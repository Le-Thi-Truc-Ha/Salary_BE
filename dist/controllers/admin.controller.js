"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShiftController = exports.deleteEmployeeController = exports.resetPasswordController = exports.createEmployeeController = exports.getEmployeeController = exports.savePasswordController = exports.getShiftsController = void 0;
const service = __importStar(require("../services/admin.service"));
const getShiftsController = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;
        if (!employeeId || !month || !year) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.getShiftsService(employeeId, month, year);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.getShiftsController = getShiftsController;
const savePasswordController = async (req, res) => {
    try {
        const { accountId, oldPassword, newPassword } = req.body;
        if (!accountId || !oldPassword || !newPassword) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.savePasswordService(accountId, oldPassword, newPassword);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.savePasswordController = savePasswordController;
const getEmployeeController = async (req, res) => {
    try {
        const result = await service.getEmployeeService();
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.getEmployeeController = getEmployeeController;
const createEmployeeController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.createEmployeeService(name);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.createEmployeeController = createEmployeeController;
const resetPasswordController = async (req, res) => {
    try {
        const { employeeId, newPassword } = req.body;
        if (!employeeId || !newPassword) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.resetPasswordService(employeeId, newPassword);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.resetPasswordController = resetPasswordController;
const deleteEmployeeController = async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.deleteEmployeeService(employeeId);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.deleteEmployeeController = deleteEmployeeController;
const updateShiftController = async (req, res) => {
    try {
        const { shiftId, timeIn, timeOut } = req.body;
        if (!shiftId || !timeIn) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.updateShiftService(shiftId, timeIn, timeOut);
        return res.status(200).json({
            message: result.message,
            data: result.data,
            code: result.code
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            data: false,
            code: -1
        });
    }
};
exports.updateShiftController = updateShiftController;
