"use server"
import prisma from "@/lib/prisma";

export async function getAllPlayers() {
    try{
        const players = await prisma.user.findMany({
            include: {
                games: {
                    include: { genres: true }
                },
                tags: true
            },
            orderBy: {
                createdAt: 'desc',
            }
        },
        )
        return { success: true, data: players };
    } catch(error){
        console.error("Failed to fetch players:", error);
        return { success: false, error: "Internal Server Error" };
    }
}