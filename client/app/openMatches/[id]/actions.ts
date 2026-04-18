"use server";

import { verifyAuthToken } from "@/lib/auth";
import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export type MatchWithDetails = Prisma.MatchGetPayload<{
  include: {
    owner: { select: { id: true; gamerTag: true; avatarUrl: true } };
    game: { include: { genres: true } };
    tags: true;
    members: {
      include: {
        user: { select: { id: true; gamerTag: true; avatarUrl: true } };
      };
    };
  };
}>;

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tm_auth")?.value ?? null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  return Number(payload.sub);
}

export async function getMatch(id: number) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, gamerTag: true, avatarUrl: true } },
      game: { include: { genres: true } },
      tags: true,
      members: {
        include: {
          user: { select: { id: true, gamerTag: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!match) return { error: "Match not found" };
  return { success: true, match };
}

export async function joinMatch(matchId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return { error: "Match not found" };
  if (match.status !== "open") return { error: "Match is no longer open" };

  const existing = await prisma.matchMember.findUnique({
    where: { matchId_userId: { matchId, userId } },
  });
  if (existing) return { error: "Already a member" };

  await prisma.matchMember.create({
    data: { matchId, userId, status: "joined" },
  });

  return { success: true };
}

export async function leaveMatch(matchId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return { error: "Match not found" };
  if (match.ownerId === userId) return { error: "Owner cannot leave the match" };

  await prisma.matchMember.delete({
    where: { matchId_userId: { matchId, userId } },
  });

  return { success: true };
}
