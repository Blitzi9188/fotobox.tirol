import { NextResponse } from "next/server";
import { createSessionToken, isValidAdminLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "");
  const password = String(body.password || "");

  if (!isValidAdminLogin(email, password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = createSessionToken(email);
  const response = NextResponse.json({ ok: true });

  response.cookies.set("cms_admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
