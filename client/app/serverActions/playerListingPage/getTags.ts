"use server"
import prisma from "@/lib/prisma";

export async function getAllTags() {
    try{
        const tags = await prisma.tag.findMany();
        return { success: true, data: tags };
    } catch(error){
        console.error("Failed to fetch tags:", error);
        return { success: false, error: "Internal Server Error" };
    }
}