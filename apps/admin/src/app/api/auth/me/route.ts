import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-admin";

export async function GET() {
  const admin = await verifyAdminSession();
  return NextResponse.json(admin, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
