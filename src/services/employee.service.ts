import dayjs from "dayjs";
import { prisma, ReturnData } from "../interfaces/app.interface";
import { compare } from "bcrypt-ts";
import { createPassword } from "./app.service";

export const getStateService = async (accountId: number): Promise<ReturnData> => {
    try {
        const lastestShift = await prisma.shift.findFirst({
            where: {accountId: accountId},
            orderBy: {
                id: "desc"
            }
        })
        if (!lastestShift) {
            return({
                message: "Không tìm thấy ca làm",
                data: false,
                code: 1
            })
        }
        if (!lastestShift.timeOut) {
            return({
                message: "Tìm thấy ca làm",
                data: lastestShift.id,
                code: 0
            })
        } else {
            return({
                message: "Tìm thấy ca làm",
                data: -1,
                code: 0
            })
        }
    } catch(e) {
        console.log(e);
        return({
            message: "Xảy ra lỗi ở service",
            data: false,
            code: -1
        })
    }
}

//state = true nghĩa là đã check in chưa check out
export const changeShiftStateService = async (now: string, state: boolean, lastestShift: number, accountId: number): Promise<ReturnData> => {
    try {
        let result = null;
        if (state) {
            result = await prisma.shift.update({
                where: {id: lastestShift},
                data: {
                    timeOut: new Date(now)
                }
            })
        } else {
            result = await prisma.shift.create({
                data: {
                    accountId: accountId,
                    timeIn: new Date(now)
                }
            })
        }
        if (!result) {
            return({
                message: "Thất bại",
                data: false,
                code: 1
            })
        }
        return({
            message: "Thành công",
            data: result.id,
            code: 0
        })
    } catch(e) {
        console.log(e);
        return({
            message: "Xảy ra lỗi ở service",
            data: false,
            code: -1
        })
    }
}

export const getShiftsService = async (accountId: number, month: number, year: number): Promise<ReturnData> => {
    try {
        const startDate = new Date(year, month - 1, 1, 0, 0, 0);
        const endDate = new Date(year, month, 1, 0, 0, 0);
        
        const shifts = await prisma.shift.findMany({
            where: {
                AND: [
                    {accountId: accountId},
                    {
                        timeIn: {
                            gte: startDate,
                            lt: endDate
                        }
                    }
                ]
            },
            orderBy: {id: "desc"},
            select: {
                id: true,
                timeIn: true,
                timeOut: true
            }
        })
        
        let totalHours = 0;

        const result = shifts.map((item) => {
            let diffMs: number | null = null;
            if (item.timeIn && item.timeOut) {
                diffMs = (item.timeOut.getTime() - item.timeIn.getTime()) / (1000 * 60 * 60);
                totalHours += diffMs;
            }
            return ({
                id: item.id,
                timeIn: item.timeIn?.toISOString(),
                timeOut: item.timeOut ? item.timeOut.toISOString() : null,
                time: diffMs ? (Math.round(diffMs * 100) / 100) : null
            })
        })

        return({
            message: "Thành công",
            code: 0,
            data: {
                shifts: result,
                total: totalHours
            }
        })
    } catch(e) {
        console.log(e);
        return({
            message: "Xảy ra lỗi ở service",
            data: false,
            code: -1
        })
    }
}

export const savePasswordService = async (accountId: number, oldPassword: string, newPassword: string): Promise<ReturnData> => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                id: accountId
            },
            select: {
                password: true
            }
        })
        if (!account) {
            return({
                message: "Tài khoản không tồn tại",
                code: 1,
                data: false
            });
        }
        if (account.password) {
            const checkPassword = await compare(oldPassword, account.password);
            if (!checkPassword) {
                return({
                    message: "Mật khẩu cũ không đúng",
                    data: false,
                    code: 1
                })
            }
        }

        const hashPassword = await createPassword(newPassword);

        const updateAccount = await prisma.account.update({
            where: {
                id: accountId
            },
            data: {
                password: hashPassword
            }
        })
        return({
            message: "Đổi mật khẩu thành công",
            data: updateAccount,
            code: 0
        })
    } catch(e) {
        console.log(e);
        return({
            message: "Xảy ra lỗi ở service",
            data: false,
            code: -1
        })
    }
}