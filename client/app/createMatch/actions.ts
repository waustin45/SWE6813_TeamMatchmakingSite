"use server";

import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tm_auth")?.value ?? null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  return Number(payload.sub);
}

export async function createMatch(data: {
  title: string;
  description?: string;
  gameId: number;
  tagIds: number[];
}) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  if (!data.title.trim()) return { error: "Title is required" };
  if (!data.gameId) return { error: "Game is required" };

  const match = await prisma.match.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() ?? null,
      owner: { connect: { id: userId } },
      game: { connect: { id: data.gameId } },
      tags: { connect: data.tagIds.map((id) => ({ id })) },
      members: {
        create: { userId, status: "joined" },
      },
    },
    include: {
      game: true,
      tags: true,
      members: true,
    },
  });

  return { success: true, match };
}
