import { NextResponse } from "next/server";
import { createCaptchaChallenge } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(createCaptchaChallenge(), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }
  });
}
