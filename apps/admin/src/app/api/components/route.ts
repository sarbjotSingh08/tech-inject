import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-admin";
import { repository } from "@tech-inject/db";

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const components = await repository.getComponents();
  return NextResponse.json(
    { components },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
