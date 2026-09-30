import { NextResponse } from "next/server";
import { getViewerFromRequest } from "@/lib/auth-server";

export async function GET() {
  const viewer = await getViewerFromRequest();

  if (viewer.type === "customer") {
    return NextResponse.json(
      {
        authenticated: true,
        customer: {
          id: viewer.id,
          email: viewer.email,
          isPremium: viewer.isPremium,
        },
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  return NextResponse.json(
    { authenticated: false, customer: null },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
