import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { adminSessionOptions, AdminSessionData } from "@/lib/session";

export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSessionData>(
    cookieStore,
    adminSessionOptions,
  );
  session.destroy();

  return NextResponse.json({
    success: true,
    message: "Admin logged out successfully",
  });
}
