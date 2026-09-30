import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-admin";
import { repository } from "@tech-inject/db";

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin.isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 403 },
    );
  }

  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const comp = await repository.getComponentBySlug(slug);
    if (!comp) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }

    await repository.updateComponentStatus(comp.id, "unpublished");

    await repository.logAudit({
      actor: admin.email || "admin",
      action: "UNPUBLISH_COMPONENT",
      resource: slug,
    });

    return NextResponse.json({
      success: true,
      message: `Component "${slug}" unpublished successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unpublishing failed" },
      { status: 500 },
    );
  }
}
