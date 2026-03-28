"use server"
import prisma from "@/lib/prisma";

export async function getUserData(id: number) {
    try{
        const player = await prisma.user.findUnique({
            where: {
                id: parseInt(id.toString())
            },
            include: {
                games: true,
                tags: true
            }
        },
        )
        return { success: true, data: player };
    } catch(error){
        console.error("Failed to fetch player:", error);
        return { success: false, error: "Internal Server Error" };
    }
}