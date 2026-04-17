"use server";
import { verifyAuthToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tm_auth")?.value ?? null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  return Number(payload.sub);
}

export async function getGamesTagsData() {
  const userId = await getCurrentUserId();

  const [allGames, allTags, user] = await Promise.all([
    prisma.game.findMany({ include: { genres: true } }),
    prisma.tag.findMany(),
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          include: { games: true, tags: true },
        })
      : null,
  ]);

  return {
    allGames,
    allTags,
    savedGameIds: user?.games.map((g) => g.id) ?? [],
    savedTagIds: user?.tags.map((t) => t.id) ?? [],
  };
}

export async function saveGamesAndTags(gameIds: number[], tagIds: number[]) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      games: { set: gameIds.map((id) => ({ id })) },
      tags:  { set: tagIds.map((id) => ({ id })) },
    },
  });

  return { success: true };
}
