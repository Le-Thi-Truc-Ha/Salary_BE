import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export interface SessionValue {
    accountId: number,
    roleId: number
}

export interface ReturnData {
    message: string,
    data: any,
    code: number
}