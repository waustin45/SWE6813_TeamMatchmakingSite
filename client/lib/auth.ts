import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "tm_auth"; // team-matchmaking auth cookie

export function setAuthCookie(res: NextResponse, token: string, maxAgeSeconds: number) {
  const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`;
  res.headers.append("Set-Cookie", cookie);
}

export function clearAuthCookie(res: NextResponse) {
  const cookie = `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`;
  res.headers.append("Set-Cookie", cookie);
}

// Verify token
export function verifyAuthToken(token?: string | null) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    return payload as { sub: string; email?: string; iat?: number; exp?: number };
  } catch (e) {
    return null;
  }
}


export function getTokenFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  return match.split("=")[1] ?? null;
}
