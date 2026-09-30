import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, CustomerSessionData } from "@/lib/session";

export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession<CustomerSessionData>(
    cookieStore,
    sessionOptions,
  );
  session.destroy();

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
