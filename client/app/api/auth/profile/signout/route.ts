import { clearAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  // 1. Create the response object
  const response = NextResponse.json(
    { message: "Signed out successfully" },
    { status: 200 }
  );

  // 2. Use the helper to add the "Set-Cookie" header with Max-Age=0
  // This tells the browser to delete the cookie immediately
  clearAuthCookie(response);

  return response;
}