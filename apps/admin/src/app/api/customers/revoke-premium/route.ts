import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-admin";
import { repository } from "@tech-inject/db";

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { customerId } = await req.json();
  if (!customerId) {
    return NextResponse.json(
      { error: "customerId is required" },
      { status: 400 },
    );
  }

  const customer = await repository.updateCustomerPremiumStatus(
    customerId,
    false,
  );
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  await repository.logAudit({
    actor: admin.email || "admin",
    action: "REVOKE_PREMIUM",
    resource: customer.email,
  });

  return NextResponse.json({ success: true, customer });
}
