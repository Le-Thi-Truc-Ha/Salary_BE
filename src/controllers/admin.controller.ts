import { Request, Response } from "express";
import { ReturnData } from "../interfaces/app.interface";
import * as service from "../services/admin.service";

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
export const getShiftsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {employeeId, month, year} = req.body;
        if (!employeeId || !month || !year) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        
        const result: ReturnData = await service.getShiftsService(employeeId, month, year);
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

export const getEmployeeController = async (req: Request, res: Response): Promise<any> => {
    try {
        const result: ReturnData = await service.getEmployeeService();
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

export const createEmployeeController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {name} = req.body;
        if (!name) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        const result: ReturnData = await service.createEmployeeService(name);
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

export const resetPasswordController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {employeeId, newPassword} = req.body;
        if (!employeeId || !newPassword) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        const result: ReturnData = await service.resetPasswordService(employeeId, newPassword);
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

export const deleteEmployeeController = async (req: Request, res: Response): Promise<any> => {
    try {
        const {employeeId} = req.body;
        if (!employeeId) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            })
        }
        const result: ReturnData = await service.deleteEmployeeService(employeeId);
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