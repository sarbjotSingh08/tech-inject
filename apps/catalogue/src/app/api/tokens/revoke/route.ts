import { NextRequest, NextResponse } from "next/server";
import { getViewerFromRequest } from "@/lib/auth-server";
import { repository } from "@tech-inject/db";

export async function POST(req: NextRequest) {
  const viewer = await getViewerFromRequest();

  if (viewer.type !== "customer") {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const { tokenId } = await req.json();
  if (!tokenId) {
    return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
  }

  const success = await repository.revokeToken(tokenId, viewer.id);
  if (!success) {
    return NextResponse.json(
      { error: "Token not found or already revoked" },
      { status: 404 },
    );
  }

  await repository.logAudit({
    actor: viewer.email,
    action: "REVOKE_CLI_TOKEN",
    resource: tokenId,
  });

  return NextResponse.json({
    success: true,
    message: "CLI Token revoked successfully",
  });
}
