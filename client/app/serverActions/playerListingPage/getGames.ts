"use server"
import prisma from "@/lib/prisma";

export async function getAllGames() {
    try{
        const games = await prisma.game.findMany({ include: { genres: true } });
        //console.log(games);
        return { success: true, data: games };
    } catch(error){
        console.error("Failed to fetch games:", error);
        return { success: false, error: "Internal Server Error" };
    }
}