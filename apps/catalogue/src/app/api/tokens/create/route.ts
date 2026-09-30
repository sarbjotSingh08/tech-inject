import { NextRequest, NextResponse } from "next/server";
import { getViewerFromRequest } from "@/lib/auth-server";
import { repository, generateCliToken } from "@tech-inject/db";

export async function POST(req: NextRequest) {
  const viewer = await getViewerFromRequest();

  if (viewer.type !== "customer") {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const { name } = await req.json().catch(() => ({ name: "CLI Token" }));
  const tokenName = name || "CLI Token";

  const { token, hashedToken } = generateCliToken();

  const tokenRecord = await repository.createAccessToken({
    customerId: viewer.id,
    name: tokenName,
    hashedToken,
  });

  await repository.logAudit({
    actor: viewer.email,
    action: "CREATE_CLI_TOKEN",
    resource: tokenRecord.id,
  });

  // Plaintext token is returned ONLY ONCE upon creation!
  return NextResponse.json({
    token, // Plaintext shown once
    tokenId: tokenRecord.id,
    name: tokenRecord.name,
    createdAt: tokenRecord.createdAt,
  });
}
