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
exports.savePasswordController = exports.getShiftsController = exports.changeShiftStateController = exports.getStateController = void 0;
const service = __importStar(require("../services/employee.service"));
const getStateController = async (req, res) => {
    try {
        const user = req.user;
        const result = await service.getStateService(user?.accountId ?? -1);
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
exports.getStateController = getStateController;
const changeShiftStateController = async (req, res) => {
    try {
        const { now, state, lastestShift } = req.body;
        if (!now || state == undefined || !lastestShift) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const user = req.user;
        const result = await service.changeShiftStateService(now, state, lastestShift, user?.accountId ?? -1);
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
exports.changeShiftStateController = changeShiftStateController;
const getShiftsController = async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const user = req.user;
        const result = await service.getShiftsService(user?.accountId ?? -1, month, year);
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
