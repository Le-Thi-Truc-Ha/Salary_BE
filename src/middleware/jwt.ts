import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid"; 
import { redis } from "../configs/redis";
import { prisma, SessionValue } from "../interfaces/app.interface";

dotenv.config();

export const createSession = async (value: SessionValue): Promise<string> => {
    try {
        let sessionKey: string = "";
        const uuid = uuidv4();
        await redis.set(uuid, JSON.stringify(value), "EX", 60*60*24*30);
        await redis.sadd(`session:${value.accountId}`, uuid);
        sessionKey = `${uuid}=${value.accountId}`;
        return sessionKey;
    } catch(e) {
        console.log(e);
        return "";
    }
}

export const verifySession = async (sessionKey: string): Promise<SessionValue | null> => {
    try {
        const [uuid, accountId] = sessionKey.split("=");

        const sessionValue = await redis.get(uuid);
        if (!sessionValue) {
            return null;
        }

        const isMember = await redis.sismember(`session:${accountId}`, uuid);
        if (isMember == 0) {
            return null;
        }

        return JSON.parse(sessionValue);
    } catch(e) {
        console.log(e);
        return null;
    }
}

export const getAllSession = async (sessionKey: string): Promise<SessionValue[]> => {
    try {
        const [uuid, accountId] = sessionKey.split("=");

        const uuids = await redis.smembers(`session:${accountId}`);

        const sessionValues: SessionValue[] = [];
        for (const item of uuids) {
            const value = await redis.get(item);
            if (value) {
                sessionValues.push(JSON.parse(value));
            }
        } 

        return sessionValues;
    } catch(e) {
        console.log(e);
        return [];
    }
}

export const deleteAllSession = async (sessionKey: string): Promise<void> => {
    try {
        const [uuid, accountId] = sessionKey.split("=");

        const uuids = await redis.smembers(`session:${accountId}`);
        
        for (const item of uuids) {
            await redis.del(item);
        } 
    } catch(e) {
        console.log(e);
    }
}

export const deleteOneSession = async (sessionKey: string): Promise<void> => {
    try {
        const [uuid, accountId] = sessionKey.split("=");

        await redis.del(uuid);
        await redis.srem(`session:${accountId}`, uuid);
    } catch(e) {
        console.log(e);
    }
}

export const checkLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers["authorization"];
    const sessionKey = authHeader && authHeader.split(" ")[1];

    if (!sessionKey) {
        return res.status(200).json({
            message: "Bạn chưa đăng nhập",
            data: false,
            code: 1
        });
    }

    const sessionValue = await verifySession(sessionKey);

    if (!sessionValue) {
        return res.status(200).json({
            message: "Session không hợp lệ",
            data: false,
            code: 1
        });
    }

    req.user = sessionValue;
    req.sessionKey = sessionKey;

    next();
}

export const getPermission = async (roleId: number) => {
    try {
        const permissions = await prisma.permission.findMany({
            where: {roleId: roleId},
            select: {
                url: true
            }
        })
        return permissions ? permissions : [];
    } catch(e) {
        console.log(e);
    }
}

export const checkPermission = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (req.user && typeof req.user !== "string") {
        const permissions = await getPermission(req.user.roleId);

        if (permissions?.length == 0 || !permissions) {
            return res.status(200).json({
                message: "Không có quyền truy cập",
                data: false,
                code: 1
            });
        }

        let currentPath = req.path;

        if (req.user.roleId == 1) {
            currentPath = "/admin" + currentPath;
        } else if (req.user.roleId == 2) {
            currentPath = "/employee" + currentPath;
        }

        let canAccess = permissions.some((item) => (item?.url == currentPath))
        if (canAccess) {
            next();
        } else {
            return res.status(200).json({
                message: "Không có quyền truy cập",
                data: false,
                code: 1
            });
        }
    } else {
        return res.status(200).json({
            message: "Không thể xác thực người dùng",
            data: false,
            code: 1
        });
    }
}