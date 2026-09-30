import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, CustomerSessionData } from "./session";
import { repository, Viewer, hashToken } from "@tech-inject/db";

export async function getViewerFromRequest(): Promise<Viewer> {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  // 1. Check Bearer Token (CLI Token)
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const plainToken = authHeader.substring(7).trim();
    if (plainToken) {
      const hashed = hashToken(plainToken);
      const customer = await repository.getCustomerByToken(hashed);
      if (customer) {
        return {
          type: "customer",
          id: customer.id,
          email: customer.email,
          isPremium: customer.isPremium,
        };
      }
    }
  }

  // 2. Check Cookie Session
  const cookieStore = await cookies();
  const session = await getIronSession<CustomerSessionData>(
    cookieStore,
    sessionOptions,
  );

  if (session.customerId && session.email) {
    const customer = await repository.getCustomerById(session.customerId);
    if (customer) {
      return {
        type: "customer",
        id: customer.id,
        email: customer.email,
        isPremium: customer.isPremium,
      };
    }
  }

  return { type: "signed_out" };
}
