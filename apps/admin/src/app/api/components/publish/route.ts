import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-admin";
import { validateComponentBundle } from "@tech-inject/registry-schema";
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
    const bundleJson = await req.json();

    // 1. Validate bundle against strict Zod schema
    const validation = validateComponentBundle(bundleJson);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        {
          error: "Bundle validation failed",
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    const bundle = validation.data;

    // 2. Find existing component or create new one
    let comp = await repository.getComponentBySlug(bundle.slug);
    if (!comp) {
      comp = await repository.createComponent({
        slug: bundle.slug,
        name: bundle.name,
        description: bundle.description,
        category: bundle.category,
        accessLevel: bundle.access,
        status: "draft",
      });
    }

    // 3. Store immutable component version record
    const versionRecord = await repository.createComponentVersion({
      componentId: comp.id,
      version: bundle.version,
      bundleJson: bundle,
    });

    // 4. Atomically update current_version_id and status published
    await repository.updateComponentStatus(
      comp.id,
      "published",
      versionRecord.id,
    );

    // 5. Log audit trail
    await repository.logAudit({
      actor: admin.email || "admin",
      action: "PUBLISH_COMPONENT",
      resource: bundle.slug,
      metadata: {
        version: bundle.version,
        access: bundle.access,
        hash: versionRecord.bundleHash,
      },
    });

    return NextResponse.json({
      success: true,
      component: {
        id: comp.id,
        slug: bundle.slug,
        name: bundle.name,
        version: bundle.version,
        access: bundle.access,
        status: "published",
        bundleHash: versionRecord.bundleHash,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Publishing failed" },
      { status: 500 },
    );
  }
}
