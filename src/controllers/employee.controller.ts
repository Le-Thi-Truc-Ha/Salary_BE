import { Request, Response } from "express";
import { ReturnData } from "../interfaces/app.interface";
import * as service from "../services/employee.service";

export const getStateController = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user;
        const result: ReturnData = await service.getStateService(user?.accountId ?? -1);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        })
    }
}

export const changeShiftStateController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {now, state, lastestShift} = req.body;
        if (!now || state == undefined || !lastestShift) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        const user = req.user;
        const result: ReturnData = await service.changeShiftStateService(now, state, lastestShift, user?.accountId ?? -1);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        })
    }
}

export const getShiftsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {month, year} = req.body;
        if (!month || !year) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }

        const user = req.user;
        
        const result: ReturnData = await service.getShiftsService(user?.accountId ?? -1, month, year);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        })
    }
}

export const savePasswordController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {accountId, oldPassword, newPassword} = req.body;
        if (!accountId || !oldPassword || !newPassword) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        const result: ReturnData = await service.savePasswordService(accountId, oldPassword, newPassword);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        })
    }
}