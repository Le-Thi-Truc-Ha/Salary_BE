import { Request, Response } from "express";
import { ReturnData, SessionValue } from "../interfaces/app.interface";
import * as service from "../services/app.service";
import { deleteOneSession, verifySession } from "../middleware/jwt";

export const awakeBackendController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("Awake backend");
        return res.status(200).send("Sucsess");
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        })
    }
}

export const reloadPageController = async (req: Request, res: Response): Promise<any> => {
    try {
        const authHeader = req.headers["authorization"];
        const sessionKey = authHeader && authHeader.split(" ")[1];

        if (!sessionKey) {
            return res.status(200).json({
                message: "Bạn chưa đăng nhập",
                data: false,
                code: 1,
            });
        }
        
        const sessionValue: SessionValue | null = await verifySession(sessionKey);

        if (!sessionValue) {
            return res.status(200).json({
                message: "Session không hợp lệ",
                data: false,
                code: 1,
            });
        }

        return res.status(200).json({
            message: "Xác thực thành công",
            code: 0,
            data: sessionValue
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            code: -1,
            data: false
        })
    }
}

export const loginController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        const result: ReturnData = await service.loginService(username, password);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            code: -1,
            data: false
        })
    }
}

export const logoutController = async (req: Request, res: Response): Promise<any> => {
    try {
        const authHeader = req.headers["authorization"];
        const sessionKey = authHeader && authHeader.split(" ")[1];

        if (!sessionKey) {
            return res.status(200).json({
                message: "Bạn chưa đăng nhập",
                data: false,
                code: 1,
            });
        }

        await deleteOneSession(sessionKey);

        return res.status(200).json({
            message: "Đăng xuất thành công",
            code: 0,
            data: true
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            code: -1,
            data: false
        })
    }
}