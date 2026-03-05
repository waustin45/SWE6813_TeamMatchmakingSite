// client/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, gamerTag, playStyle } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        gamerTag,
        playStyle,
        passwordHash
      } as Prisma.UserCreateInput,
      select: { id: true, email: true, name: true, gamerTag: true }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("signup error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
