import { NextRequest, NextResponse } from "next/server";
import { repository, canAccess } from "@tech-inject/db";
import { getViewerFromRequest } from "@/lib/auth-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const viewer = await getViewerFromRequest();

  const component = await repository.getComponentBySlug(slug);
  if (!component || component.status !== "published") {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const hasAccess = canAccess(viewer, {
    slug: component.slug,
    accessLevel: component.accessLevel,
    status: component.status,
  });

  if (!hasAccess) {
    return NextResponse.json(
      {
        error:
          "Access denied. Premium subscription required to view source code.",
      },
      { status: 403, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  const latestVer = await repository.getLatestVersionForComponent(component.id);
  if (!latestVer) {
    return NextResponse.json(
      { error: "Component version not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      slug: component.slug,
      version: latestVer.version,
      files: latestVer.bundleJson.files,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
