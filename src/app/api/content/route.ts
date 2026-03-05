import { NextResponse } from "next/server";
import { readCmsContent } from "@/lib/cms";

export async function GET() {
  const content = await readCmsContent();
  return NextResponse.json(content);
}
