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
exports.logoutController = exports.loginController = exports.reloadPageController = exports.awakeBackendController = exports.rootController = void 0;
const service = __importStar(require("../services/app.service"));
const jwt_1 = require("../middleware/jwt");
const rootController = async (req, res) => {
    try {
        return res.status(200).send("Server is alive");
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
exports.rootController = rootController;
const awakeBackendController = async (req, res) => {
    try {
        console.log("Awake backend");
        return res.status(200).send("Sucsess");
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
exports.awakeBackendController = awakeBackendController;
const reloadPageController = async (req, res) => {
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
        const sessionValue = await (0, jwt_1.verifySession)(sessionKey);
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
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            code: -1,
            data: false
        });
    }
};
exports.reloadPageController = reloadPageController;
const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(200).json({
                message: "Không nhận được dữ liệu",
                data: false,
                code: 1
            });
        }
        const result = await service.loginService(username, password);
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
            code: -1,
            data: false
        });
    }
};
exports.loginController = loginController;
const logoutController = async (req, res) => {
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
        await (0, jwt_1.deleteOneSession)(sessionKey);
        return res.status(200).json({
            message: "Đăng xuất thành công",
            code: 0,
            data: true
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Xảy ra lỗi ở controller",
            code: -1,
            data: false
        });
    }
};
exports.logoutController = logoutController;
