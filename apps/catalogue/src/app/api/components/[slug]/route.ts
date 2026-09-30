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

  const latestVer = await repository.getLatestVersionForComponent(component.id);
  if (!latestVer) {
    return NextResponse.json(
      { error: "Component has no published version" },
      { status: 404 },
    );
  }

  const hasAccess = canAccess(viewer, {
    slug: component.slug,
    accessLevel: component.accessLevel,
    status: component.status,
  });

  const bundle = latestVer.bundleJson;

  if (!hasAccess) {
    // Return sanitized metadata WITHOUT exposing premium files, source code, or dependencies
    return NextResponse.json(
      {
        component: {
          id: component.id,
          slug: component.slug,
          name: component.name,
          description: component.description,
          category: component.category,
          accessLevel: component.accessLevel,
          status: component.status,
          version: latestVer.version,
        },
        hasAccess: false,
        message:
          "This component requires an active Premium Customer subscription.",
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  return NextResponse.json(
    {
      component: {
        id: component.id,
        slug: component.slug,
        name: component.name,
        description: component.description,
        category: component.category,
        accessLevel: component.accessLevel,
        status: component.status,
        version: latestVer.version,
      },
      hasAccess: true,
      bundle,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
