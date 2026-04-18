"use server"
import UserDataInterface from "@/interfaces/userDataInterface";
import UserDataReturn from "@/interfaces/userDataReturn";
import prisma from "@/lib/prisma";

export async function getUserData(id: number): Promise<UserDataReturn> {
    try{
        const player = await prisma.user.findUnique({
            where: {
                id: parseInt(id.toString())
            },
            include: {
                games: { include: { genres: true } },
                tags: true
            }
        })
        if (!player) return { success: false, error: "User not found", data: null };
        return { success: true, data: player as unknown as UserDataInterface };
    } catch(error){
        console.error("Failed to fetch player:", error);
        return { success: false, error: "Internal Server Error", data: null };
    }
}