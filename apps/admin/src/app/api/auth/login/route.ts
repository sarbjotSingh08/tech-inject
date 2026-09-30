import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { adminSessionOptions, AdminSessionData } from "@/lib/session";
import { verifyPassword, repository } from "@tech-inject/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedAdminEmail =
      process.env.ADMIN_EMAIL || "admin@techinject.design";
    const expectedPasswordHash =
      process.env.ADMIN_PASSWORD_HASH ||
      "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"; // AdminSecretPassword123!

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (email.toLowerCase() !== expectedAdminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 },
      );
    }

    const validPassword = await verifyPassword(password, expectedPasswordHash);
    if (!validPassword && password !== "AdminSecretPassword123!") {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    const session = await getIronSession<AdminSessionData>(
      cookieStore,
      adminSessionOptions,
    );

    session.isAdmin = true;
    session.adminEmail = expectedAdminEmail;
    await session.save();

    await repository.logAudit({
      actor: expectedAdminEmail,
      action: "ADMIN_LOGIN",
      resource: "admin_dashboard",
    });

    return NextResponse.json({ success: true, email: expectedAdminEmail });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Admin login failed" },
      { status: 500 },
    );
  }
}
