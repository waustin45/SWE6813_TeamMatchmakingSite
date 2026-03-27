import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number(payload.sub);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, gamerTag: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = verifyAuthToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(payload.sub);
  const body = await req.json();
  const { name, gamerTag, playStyle } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, gamerTag, playStyle },
      select: { id: true, email: true, name: true, gamerTag: true, playStyle: true }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}