import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-admin";
import { repository } from "@tech-inject/db";

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const customers = await repository.getCustomers();
  const safeList = customers.map((c) => ({
    id: c.id,
    email: c.email,
    isPremium: c.isPremium,
    premiumGrantedAt: c.premiumGrantedAt,
    premiumRevokedAt: c.premiumRevokedAt,
    createdAt: c.createdAt,
  }));

  return NextResponse.json(
    { customers: safeList },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
