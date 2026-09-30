import { NextResponse } from "next/server";
import { repository } from "@tech-inject/db";

export async function GET() {
  const components = await repository.getPublishedComponents();

  const responseList = components.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    category: c.category,
    accessLevel: c.accessLevel,
    status: c.status,
    currentVersionId: c.currentVersionId,
  }));

  return NextResponse.json(
    { components: responseList },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
