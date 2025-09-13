import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export interface SessionValue {
    id: number,
    roleId: number,
    googleLogin: boolean
}

export interface ReturnData {
    message: string,
    data: any,
    code: number
}