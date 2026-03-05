// client/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";

const JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 day timeframe 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const payload = { sub: String(user.id), email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: JWT_EXPIRY_SECONDS });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 200 });
    setAuthCookie(res, token, JWT_EXPIRY_SECONDS);
    return res;
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
