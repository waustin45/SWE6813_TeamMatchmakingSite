import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number(payload.sub);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, gamerTag: true, bio: true, avatarUrl: true, preferences: true }
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number(payload.sub);
  const body = await req.json();
  const { bio, avatarUrl, preferences } = body;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: typeof bio === "string" ? bio : undefined,
        avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
        preferences: preferences ?? undefined
      },
      select: { id: true, email: true, name: true, gamerTag: true, bio: true, avatarUrl: true, preferences: true }
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Profile update error", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

