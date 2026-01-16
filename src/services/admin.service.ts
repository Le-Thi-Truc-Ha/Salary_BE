import { compare } from "bcrypt-ts";
import { prisma, ReturnData } from "../interfaces/app.interface";
import { createPassword } from "./app.service";
import { deleteAllSession } from "../middleware/jwt";

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
        for (const shift of shifts) {
            if (shift.timeIn && shift.timeOut) {
                const diffMs = shift.timeOut.getTime() - shift.timeIn.getTime();
                totalHours += diffMs / (1000 * 60 * 60);
            }
        }

        const result = shifts.map((item) => (
            {
                id: item.id,
                timeIn: item.timeIn?.toISOString(),
                timeOut: item.timeOut ? item.timeOut.toISOString() : null
            }
        ))

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

export const getEmployeeService = async (): Promise<ReturnData> => {
    try {
        const employee = await prisma.account.findMany({
            where: {
                AND: [
                    {roleId: 2},
                    {status: 1}
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
        })
        
        return({
            message: "Thành công",
            data: employee,
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

export const createEmployeeService = async (name: string): Promise<ReturnData> => {
    try {
        let randomNumber = "";

        for (let i = 0; i < 6; i++) {
            randomNumber += Math.floor(Math.random() * 10);
        }

        const processName = name.trim().split(/\s+/);

        const username = processName.pop()?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").trim().toLowerCase().concat(randomNumber);

        if (!username) {
            return({
                message: "Xảy ra lỗi khi tạo username",
                data: false,
                code: 1
            })
        }
        
        const newAccount = await prisma.account.create({
            data: {
                fullName: name,
                username: username,
                password: await createPassword("123456789"),
                status: 1,
                roleId: 2
            }
        })
        
        return({
            message: "Thêm tài khoản thành công",
            data: newAccount,
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

export const resetPasswordService = async (employeeId: number, newPassword: string): Promise<ReturnData> => {
    try {
        const result = await prisma.account.update({
            where: {
                id: employeeId
            },
            data: {
                password: await createPassword(newPassword)
            }
        })
        
        if (!result) {
            return({
                message: "Không tìm thấy tài khoản",
                data: false,
                code: 1
            })
        }

        return({
            message: "Đổi mật khẩu thành công",
            data: true,
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

export const deleteEmployeeService = async (employeeId: number): Promise<ReturnData> => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const deleteShift = await tx.shift.deleteMany({
                where: {
                    accountId: employeeId
                }
            })
            
            const deleteAccount = await tx.account.delete({
                where: {
                    id: employeeId
                }
            })
        })

        await deleteAllSession(employeeId)

        return({
            message: "Xóa tài khoản thành công",
            data: true,
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