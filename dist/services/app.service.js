"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.createPassword = void 0;
const bcrypt_ts_1 = require("bcrypt-ts");
const app_interface_1 = require("../interfaces/app.interface");
const jwt_1 = require("../middleware/jwt");
const createPassword = async (password) => {
    const salt = await (0, bcrypt_ts_1.genSalt)(10);
    const result = await (0, bcrypt_ts_1.hash)(password, salt);
    return result;
};
exports.createPassword = createPassword;
const loginService = async (username, password) => {
    try {
        const existAccount = await app_interface_1.prisma.account.findFirst({
            where: {
                AND: [
                    { username: username },
                    { status: 1 }
                ]
            },
            select: {
                id: true,
                roleId: true,
                password: true
            }
        });
        if (!existAccount) {
            return ({
                message: "Tài khoản không tồn tại",
                data: false,
                code: 1
            });
        }
        const correctPassword = await (0, bcrypt_ts_1.compare)(password, existAccount.password);
        if (!correctPassword) {
            return ({
                message: "Sai mật khẩu",
                data: false,
                code: 1
            });
        }
        const sessionValue = {
            accountId: existAccount.id,
            roleId: existAccount.roleId ?? -1
        };
        const sessionKey = await (0, jwt_1.createSession)(sessionValue);
        return ({
            message: "Đăng nhập thành công",
            code: 0,
            data: {
                id: existAccount.id,
                roleId: existAccount.roleId,
                sessionKey: sessionKey
            }
        });
    }
    catch (e) {
        console.log(e);
        return ({
            message: "Xảy ra lỗi ở service",
            data: false,
            code: -1
        });
    }
};
exports.loginService = loginService;
