import { SessionOptions } from "iron-session";

export interface AdminSessionData {
  isAdmin?: boolean;
  adminEmail?: string;
}

export const adminSessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "super-secret-32-character-min-session-key-for-iron-session",
  cookieName: "tech_inject_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
