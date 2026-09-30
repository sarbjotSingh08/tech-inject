import { describe, it, expect } from "vitest";
import {
  canAccess,
  Viewer,
  TargetComponent,
  hashPassword,
  verifyPassword,
  generateCliToken,
  hashToken,
} from "./auth";

describe("Central Authorization - canAccess", () => {
  const freePublished: TargetComponent = {
    slug: "button",
    accessLevel: "free",
    status: "published",
  };
  const premiumPublished: TargetComponent = {
    slug: "data-table",
    accessLevel: "premium",
    status: "published",
  };
  const freeDraft: TargetComponent = {
    slug: "button",
    accessLevel: "free",
    status: "draft",
  };
  const premiumDraft: TargetComponent = {
    slug: "kanban",
    accessLevel: "premium",
    status: "draft",
  };
  const freeUnpublished: TargetComponent = {
    slug: "button",
    accessLevel: "free",
    status: "unpublished",
  };
  const premiumUnpublished: TargetComponent = {
    slug: "kanban",
    accessLevel: "premium",
    status: "unpublished",
  };

  const signedOut: Viewer = { type: "signed_out" };
  const freeCustomer: Viewer = {
    type: "customer",
    id: "cust-1",
    email: "free@example.com",
    isPremium: false,
  };
  const premiumCustomer: Viewer = {
    type: "customer",
    id: "cust-2",
    email: "premium@example.com",
    isPremium: true,
  };
  const revokedCustomer: Viewer = {
    type: "customer",
    id: "cust-3",
    email: "revoked@example.com",
    isPremium: false,
  };
  const admin: Viewer = { type: "admin" };

  describe("Signed out visitors", () => {
    it("can access published free components", () => {
      expect(canAccess(signedOut, freePublished)).toBe(true);
    });

    it("CANNOT access published premium components", () => {
      expect(canAccess(signedOut, premiumPublished)).toBe(false);
    });

    it("CANNOT access draft components", () => {
      expect(canAccess(signedOut, freeDraft)).toBe(false);
      expect(canAccess(signedOut, premiumDraft)).toBe(false);
    });

    it("CANNOT access unpublished components", () => {
      expect(canAccess(signedOut, freeUnpublished)).toBe(false);
      expect(canAccess(signedOut, premiumUnpublished)).toBe(false);
    });
  });

  describe("Signed in Free customers", () => {
    it("can access published free components", () => {
      expect(canAccess(freeCustomer, freePublished)).toBe(true);
    });

    it("CANNOT access published premium components", () => {
      expect(canAccess(freeCustomer, premiumPublished)).toBe(false);
    });

    it("CANNOT access drafts or unpublished", () => {
      expect(canAccess(freeCustomer, freeDraft)).toBe(false);
      expect(canAccess(freeCustomer, freeUnpublished)).toBe(false);
    });
  });

  describe("Signed in Premium customers", () => {
    it("can access published free components", () => {
      expect(canAccess(premiumCustomer, freePublished)).toBe(true);
    });

    it("can access published premium components", () => {
      expect(canAccess(premiumCustomer, premiumPublished)).toBe(true);
    });

    it("CANNOT access drafts or unpublished (Premium users cannot view unreleased code)", () => {
      expect(canAccess(premiumCustomer, freeDraft)).toBe(false);
      expect(canAccess(premiumCustomer, premiumDraft)).toBe(false);
      expect(canAccess(premiumCustomer, freeUnpublished)).toBe(false);
      expect(canAccess(premiumCustomer, premiumUnpublished)).toBe(false);
    });
  });

  describe("Revoked Premium customers", () => {
    it("can access published free components", () => {
      expect(canAccess(revokedCustomer, freePublished)).toBe(true);
    });

    it("CANNOT access published premium components", () => {
      expect(canAccess(revokedCustomer, premiumPublished)).toBe(false);
    });
  });

  describe("Admin", () => {
    it("can access all components in all states", () => {
      expect(canAccess(admin, freePublished)).toBe(true);
      expect(canAccess(admin, premiumPublished)).toBe(true);
      expect(canAccess(admin, freeDraft)).toBe(true);
      expect(canAccess(admin, premiumDraft)).toBe(true);
      expect(canAccess(admin, freeUnpublished)).toBe(true);
      expect(canAccess(admin, premiumUnpublished)).toBe(true);
    });
  });
});

describe("Password & Token Utilities", () => {
  it("hashes and verifies passwords", async () => {
    const password = "MySecurePassword123!";
    const hash = await hashPassword(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("generates unique revocable CLI tokens", () => {
    const { token, hashedToken } = generateCliToken();
    expect(token.startsWith("ti_live_")).toBe(true);
    expect(hashToken(token)).toBe(hashedToken);
  });
});
