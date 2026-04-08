"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePasswordService = exports.getShiftsService = exports.changeShiftStateService = exports.getStateService = void 0;
const app_interface_1 = require("../interfaces/app.interface");
const bcrypt_ts_1 = require("bcrypt-ts");
const app_service_1 = require("./app.service");
const getStateService = async (accountId) => {
    try {
        const lastestShift = await app_interface_1.prisma.shift.findFirst({
            where: { accountId: accountId },
            orderBy: {
                id: "desc"
            }
        });
        if (!lastestShift) {
            return ({
                message: "Không tìm thấy ca làm",
                data: false,
                code: 1
            });
        }
        if (!lastestShift.timeOut) {
            return ({
                message: "Tìm thấy ca làm",
                data: lastestShift.id,
                code: 0
            });
        }
        else {
            return ({
                message: "Tìm thấy ca làm",
                data: -1,
                code: 0
            });
        }
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
exports.getStateService = getStateService;
//state = true nghĩa là đã check in chưa check out
const changeShiftStateService = async (now, state, lastestShift, accountId) => {
    try {
        let result = null;
        if (state) {
            result = await app_interface_1.prisma.shift.update({
                where: { id: lastestShift },
                data: {
                    timeOut: new Date(now)
                }
            });
        }
        else {
            result = await app_interface_1.prisma.shift.create({
                data: {
                    accountId: accountId,
                    timeIn: new Date(now)
                }
            });
        }
        if (!result) {
            return ({
                message: "Thất bại",
                data: false,
                code: 1
            });
        }
        return ({
            message: "Thành công",
            data: result.id,
            code: 0
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
exports.changeShiftStateService = changeShiftStateService;
const getShiftsService = async (accountId, month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1, 0, 0, 0);
        const endDate = new Date(year, month, 1, 0, 0, 0);
        const shifts = await app_interface_1.prisma.shift.findMany({
            where: {
                AND: [
                    { accountId: accountId },
                    {
                        timeIn: {
                            gte: startDate,
                            lt: endDate
                        }
                    }
                ]
            },
            orderBy: { id: "desc" },
            select: {
                id: true,
                timeIn: true,
                timeOut: true
            }
        });
        let totalHours = 0;
        const result = shifts.map((item) => {
            let diffMs = null;
            if (item.timeIn && item.timeOut) {
                diffMs = (item.timeOut.getTime() - item.timeIn.getTime()) / (1000 * 60 * 60);
                totalHours += diffMs;
            }
            return ({
                id: item.id,
                timeIn: item.timeIn?.toISOString(),
                timeOut: item.timeOut ? item.timeOut.toISOString() : null,
                time: diffMs ? (Math.round(diffMs * 100) / 100) : null
            });
        });
        return ({
            message: "Thành công",
            code: 0,
            data: {
                shifts: result,
                total: totalHours
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
exports.getShiftsService = getShiftsService;
const savePasswordService = async (accountId, oldPassword, newPassword) => {
    try {
        const account = await app_interface_1.prisma.account.findFirst({
            where: {
                id: accountId
            },
            select: {
                password: true
            }
        });
        if (!account) {
            return ({
                message: "Tài khoản không tồn tại",
                code: 1,
                data: false
            });
        }
        if (account.password) {
            const checkPassword = await (0, bcrypt_ts_1.compare)(oldPassword, account.password);
            if (!checkPassword) {
                return ({
                    message: "Mật khẩu cũ không đúng",
                    data: false,
                    code: 1
                });
            }
        }
        const hashPassword = await (0, app_service_1.createPassword)(newPassword);
        const updateAccount = await app_interface_1.prisma.account.update({
            where: {
                id: accountId
            },
            data: {
                password: hashPassword
            }
        });
        return ({
            message: "Đổi mật khẩu thành công",
            data: updateAccount,
            code: 0
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
exports.savePasswordService = savePasswordService;
