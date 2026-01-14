import { compare } from "bcrypt-ts";
import { prisma, ReturnData, SessionValue } from "../interfaces/app.interface";
import { createSession } from "../middleware/jwt";

export const loginService = async (username: string, password: string): Promise<ReturnData> => {
    try {
        const existAccount = await prisma.account.findFirst({
            where: {
                AND: [
                    {username: username},
                    {status: 1}
                ]
            },
            select: {
                id: true,
                roleId: true,
                password: true
            }
        });
        if (!existAccount) {
            return({
                message: "Tài khoản không tồn tại",
                data: false,
                code: 1
            })
        }
        const correctPassword = await compare(password, existAccount.password);
        if (!correctPassword) {
            return({
                message: "Sai mật khẩu",
                data: false,
                code: 1
            })
        }
        const sessionValue: SessionValue = {
            accountId: existAccount.id,
            roleId: existAccount.roleId ?? -1
        }
        const sessionKey = await createSession(sessionValue);
        return({
            message: "Đăng nhập thành công",
            code: 0,
            data: {
                id: existAccount.id,
                roleId: existAccount.roleId,
                sessionKey: sessionKey
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