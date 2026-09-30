import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, CustomerSessionData } from "@/lib/session";
import { repository, verifyPassword } from "@tech-inject/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const customer = await repository.getCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const validPassword = await verifyPassword(password, customer.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    const session = await getIronSession<CustomerSessionData>(
      cookieStore,
      sessionOptions,
    );

    session.customerId = customer.id;
    session.email = customer.email;
    session.isPremium = customer.isPremium;
    await session.save();

    await repository.logAudit({
      actor: customer.email,
      action: "CUSTOMER_LOGIN",
      resource: customer.id,
    });

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        isPremium: customer.isPremium,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Login failed" },
      { status: 500 },
    );
  }
}
