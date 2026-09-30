import React from "react";
import { notFound } from "next/navigation";
import { repository, canAccess } from "@tech-inject/db";
import { getViewerFromRequest } from "@/lib/auth-server";
import { ComponentDetailClient } from "./ComponentDetailClient";

export const revalidate = 0;

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await getViewerFromRequest();

  const component = await repository.getComponentBySlug(slug);
  if (!component || component.status !== "published") {
    notFound();
  }

  const hasAccess = canAccess(viewer, {
    slug: component.slug,
    accessLevel: component.accessLevel,
    status: component.status,
  });

  const latestVer = await repository.getLatestVersionForComponent(component.id);
  if (!latestVer) {
    notFound();
  }

  const bundle = latestVer.bundleJson;

  return (
    <ComponentDetailClient
      component={{
        id: component.id,
        slug: component.slug,
        name: component.name,
        description: component.description,
        category: component.category,
        accessLevel: component.accessLevel,
        status: component.status,
        version: latestVer.version,
      }}
      hasAccess={hasAccess}
      bundle={hasAccess ? bundle : null}
      viewer={viewer}
    />
  );
}
