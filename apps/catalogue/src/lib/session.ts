import { SessionOptions } from "iron-session";

export interface CustomerSessionData {
  customerId?: string;
  email?: string;
  isPremium?: boolean;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "super-secret-32-character-min-session-key-for-iron-session",
  cookieName: "tech_inject_customer_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
