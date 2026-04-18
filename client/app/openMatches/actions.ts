"use server";

import { prisma } from "@/lib/prisma";

export async function getOpenMatches() {
  const matches = await prisma.match.findMany({
    where: { status: "open" },
    include: {
      owner: { select: { id: true, gamerTag: true, avatarUrl: true } },
      game: { include: { genres: true } },
      tags: true,
      members: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, matches };
}
