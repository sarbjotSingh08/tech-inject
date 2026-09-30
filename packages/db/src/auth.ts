import bcrypt from "bcryptjs";
import crypto from "crypto";

export type Viewer =
  | { type: "signed_out" }
  | { type: "customer"; id: string; email: string; isPremium: boolean }
  | { type: "admin" };

export interface TargetComponent {
  slug: string;
  accessLevel: "free" | "premium";
  status: "draft" | "published" | "unpublished";
}

/**
 * CENTRAL ACCESS CONTROL FUNCTION
 * Evaluates whether a viewer can access source/manifest/installation for a component.
 */
export function canAccess(viewer: Viewer, component: TargetComponent): boolean {
  // Admin has administrative access to everything
  if (viewer.type === "admin") {
    return true;
  }

  // Draft and unpublished components are NEVER accessible to public visitors or customers (including premium customers)
  if (component.status === "draft" || component.status === "unpublished") {
    return false;
  }

  // Component is published:
  if (component.accessLevel === "free") {
    // Free components are accessible to everyone
    return true;
  }

  if (component.accessLevel === "premium") {
    // Premium components require an active premium customer account
    if (viewer.type === "customer" && viewer.isPremium) {
      return true;
    }
    return false;
  }

  return false;
}

// Password management
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

// CLI Access Tokens
export function generateCliToken(): { token: string; hashedToken: string } {
  const prefix = "ti_live_";
  const randomBytes = crypto.randomBytes(24).toString("hex");
  const token = `${prefix}${randomBytes}`;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
}

export function hashToken(plainToken: string): string {
  return crypto.createHash("sha256").update(plainToken).digest("hex");
}
