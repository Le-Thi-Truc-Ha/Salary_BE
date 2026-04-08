"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShiftService = exports.deleteEmployeeService = exports.resetPasswordService = exports.createEmployeeService = exports.getEmployeeService = exports.savePasswordService = exports.getShiftsService = void 0;
const bcrypt_ts_1 = require("bcrypt-ts");
const app_interface_1 = require("../interfaces/app.interface");
const app_service_1 = require("./app.service");
const jwt_1 = require("../middleware/jwt");
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
const getEmployeeService = async () => {
    try {
        const employee = await app_interface_1.prisma.account.findMany({
            where: {
                AND: [
                    { roleId: 2 },
                    { status: 1 }
                ]
            },
            orderBy: {
                id: "desc"
            },
            select: {
                id: true,
                username: true,
                fullName: true
            }
        });
        return ({
            message: "Thành công",
            data: employee,
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
exports.getEmployeeService = getEmployeeService;
const createEmployeeService = async (name) => {
    try {
        let randomNumber = "";
        for (let i = 0; i < 6; i++) {
            randomNumber += Math.floor(Math.random() * 10);
        }
        const processName = name.trim().split(/\s+/);
        const username = processName.pop()?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").trim().toLowerCase().concat(randomNumber);
        if (!username) {
            return ({
                message: "Xảy ra lỗi khi tạo username",
                data: false,
                code: 1
            });
        }
        const newAccount = await app_interface_1.prisma.account.create({
            data: {
                fullName: name,
                username: username,
                password: await (0, app_service_1.createPassword)("123456789"),
                status: 1,
                roleId: 2
            }
        });
        return ({
            message: "Thêm tài khoản thành công",
            data: newAccount,
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
exports.createEmployeeService = createEmployeeService;
const resetPasswordService = async (employeeId, newPassword) => {
    try {
        const result = await app_interface_1.prisma.account.update({
            where: {
                id: employeeId
            },
            data: {
                password: await (0, app_service_1.createPassword)(newPassword)
            }
        });
        if (!result) {
            return ({
                message: "Không tìm thấy tài khoản",
                data: false,
                code: 1
            });
        }
        return ({
            message: "Đổi mật khẩu thành công",
            data: true,
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
exports.resetPasswordService = resetPasswordService;
const deleteEmployeeService = async (employeeId) => {
    try {
        const result = await app_interface_1.prisma.$transaction(async (tx) => {
            const deleteShift = await tx.shift.deleteMany({
                where: {
                    accountId: employeeId
                }
            });
            const deleteAccount = await tx.account.delete({
                where: {
                    id: employeeId
                }
            });
        });
        await (0, jwt_1.deleteAllSession)(employeeId);
        return ({
            message: "Xóa tài khoản thành công",
            data: true,
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
exports.deleteEmployeeService = deleteEmployeeService;
const updateShiftService = async (shiftId, timeIn, timeOut) => {
    try {
        const updateShift = await app_interface_1.prisma.shift.update({
            where: {
                id: shiftId
            },
            data: {
                timeIn: timeIn,
                timeOut: timeOut
            }
        });
        if (!updateShift) {
            return ({
                message: "Cập nhật ca làm thất bại",
                data: false,
                code: 1
            });
        }
        return ({
            message: "Cập nhật ca làm thành công",
            data: true,
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
exports.updateShiftService = updateShiftService;
