import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { adminSessionOptions, AdminSessionData } from "./session";

export async function verifyAdminSession(): Promise<{
  isAdmin: boolean;
  email?: string;
}> {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSessionData>(
    cookieStore,
    adminSessionOptions,
  );

  if (session.isAdmin && session.adminEmail) {
    return { isAdmin: true, email: session.adminEmail };
  }

  return { isAdmin: false };
}
