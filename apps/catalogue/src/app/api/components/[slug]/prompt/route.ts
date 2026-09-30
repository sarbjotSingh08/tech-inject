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
          "Access denied. Premium subscription required to view AI Agent Integration Prompt.",
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

  const bundle = latestVer.bundleJson;
  const isPremium = component.accessLevel === "premium";

  const tokenInstruction = isPremium
    ? `IMPORTANT: This is a Premium Component. Ensure the CATALOGUE_TOKEN environment variable is set in your environment before running the installer CLI command. Do NOT commit plaintext tokens to Git.`
    : `This is a Free Component. No token is required for installation.`;

  const promptContent = `
# AI AGENT INSTRUCTION: Add "${bundle.name}" Component to React/Next.js Project

## Overview
You are tasked with integrating the official "${bundle.name}" component from the Tech Inject Design Library.

${tokenInstruction}

## 1. Component Details & Installation
- **Component Name**: ${bundle.name} (${bundle.slug})
- **Version**: ${bundle.version}
- **Access Level**: ${bundle.access.toUpperCase()}
- **Category**: ${bundle.category}

Run the following command in the root of the consumer project:

\`\`\`bash
${isPremium ? "CATALOGUE_TOKEN=$CATALOGUE_TOKEN " : ""}npx @tech-inject/cli add ${bundle.slug}
\`\`\`

Target destination: \`src/components/tech-inject/${bundle.slug}/\`

## 2. Dependencies
Ensure the following packages are installed:
${
  Object.entries(bundle.npmDependencies)
    .map(([pkg, ver]) => `- ${pkg}: ${ver}`)
    .join("\n") || "- None required"
}

## 3. Theme & Styling Guidelines
- Ensure \`@tech-inject/theme/dist/theme.css\` (or Sales CRM CSS tokens) is imported at your application root (\`src/main.tsx\` or \`src/app/layout.tsx\`).
- Do NOT override core component tokens (\`--ti-bg-card\`, \`--ti-color-primary\`, \`--ti-radius-lg\`) directly. Preserve visual theme consistency.

## 4. Usage Example
\`\`\`tsx
${bundle.example}
\`\`\`

## 5. Verification & Quality Assurance Steps
1. **TypeScript Typecheck**: Run \`pnpm typecheck\` or \`npx tsc --noEmit\` to verify zero type errors.
2. **Build Verification**: Run \`pnpm build\` to confirm component compiles cleanly.
3. **Render Check**: Verify component renders properly without console warnings or layout breaks.
`.trim();

  return NextResponse.json(
    { slug: component.slug, prompt: promptContent },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
