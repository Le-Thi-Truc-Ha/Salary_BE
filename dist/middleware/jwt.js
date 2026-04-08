"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.getPermission = exports.checkLogin = exports.deleteOneSession = exports.deleteAllSession = exports.getAllSession = exports.verifySession = exports.createSession = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const redis_1 = require("../configs/redis");
const app_interface_1 = require("../interfaces/app.interface");
dotenv_1.default.config();
const createSession = async (value) => {
    try {
        let sessionKey = "";
        const uuid = (0, uuid_1.v4)();
        await redis_1.redis.set(uuid, JSON.stringify(value), "EX", 60 * 60 * 24 * 30);
        await redis_1.redis.sadd(`session:${value.accountId}`, uuid);
        sessionKey = `${uuid}=${value.accountId}`;
        return sessionKey;
    }
    catch (e) {
        console.log(e);
        return "";
    }
};
exports.createSession = createSession;
const verifySession = async (sessionKey) => {
    try {
        const [uuid, accountId] = sessionKey.split("=");
        const sessionValue = await redis_1.redis.get(uuid);
        if (!sessionValue) {
            return null;
        }
        const isMember = await redis_1.redis.sismember(`session:${accountId}`, uuid);
        if (isMember == 0) {
            return null;
        }
        return JSON.parse(sessionValue);
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
exports.verifySession = verifySession;
const getAllSession = async (sessionKey) => {
    try {
        const [uuid, accountId] = sessionKey.split("=");
        const uuids = await redis_1.redis.smembers(`session:${accountId}`);
        const sessionValues = [];
        for (const item of uuids) {
            const value = await redis_1.redis.get(item);
            if (value) {
                sessionValues.push(JSON.parse(value));
            }
        }
        return sessionValues;
    }
    catch (e) {
        console.log(e);
        return [];
    }
};
exports.getAllSession = getAllSession;
const deleteAllSession = async (accountId) => {
    try {
        const uuids = await redis_1.redis.smembers(`session:${accountId}`);
        for (const item of uuids) {
            await redis_1.redis.del(item);
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.deleteAllSession = deleteAllSession;
const deleteOneSession = async (sessionKey) => {
    try {
        const [uuid, accountId] = sessionKey.split("=");
        await redis_1.redis.del(uuid);
        await redis_1.redis.srem(`session:${accountId}`, uuid);
    }
    catch (e) {
        console.log(e);
    }
};
exports.deleteOneSession = deleteOneSession;
const checkLogin = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const sessionKey = authHeader && authHeader.split(" ")[1];
    if (!sessionKey) {
        return res.status(200).json({
            message: "Bạn chưa đăng nhập",
            data: false,
            code: 1
        });
    }
    const sessionValue = await (0, exports.verifySession)(sessionKey);
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
};
exports.checkLogin = checkLogin;
const getPermission = async (roleId) => {
    try {
        const permissions = await app_interface_1.prisma.permission.findMany({
            where: { roleId: roleId },
            select: {
                url: true
            }
        });
        return permissions ? permissions : [];
    }
    catch (e) {
        console.log(e);
    }
};
exports.getPermission = getPermission;
const checkPermission = async (req, res, next) => {
    if (req.user && typeof req.user !== "string") {
        const permissions = await (0, exports.getPermission)(req.user.roleId);
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
        }
        else if (req.user.roleId == 2) {
            currentPath = "/employee" + currentPath;
        }
        let canAccess = permissions.some((item) => (item?.url == currentPath));
        if (canAccess) {
            next();
        }
        else {
            return res.status(200).json({
                message: "Không có quyền truy cập",
                data: false,
                code: 1
            });
        }
    }
    else {
        return res.status(200).json({
            message: "Không thể xác thực người dùng",
            data: false,
            code: 1
        });
    }
};
exports.checkPermission = checkPermission;
