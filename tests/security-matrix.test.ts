import { describe, it, expect, beforeEach } from "vitest";
import {
  canAccess,
  Viewer,
  TargetComponent,
  repository,
  seedDatabase,
} from "@tech-inject/db";
import { validateComponentBundle } from "@tech-inject/registry-schema";
import { verifyPathContainment } from "@tech-inject/cli";

describe("COMPREHENSIVE SECURITY & ACCESS CONTROL MATRIX", () => {
  beforeEach(async () => {
    await seedDatabase();
  });

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
    slug: "kanban-card",
    accessLevel: "premium",
    status: "draft",
  };
  const freeUnpublished: TargetComponent = {
    slug: "button",
    accessLevel: "free",
    status: "unpublished",
  };
  const premiumUnpublished: TargetComponent = {
    slug: "kanban-card",
    accessLevel: "premium",
    status: "unpublished",
  };

  const signedOut: Viewer = { type: "signed_out" };
  const freeCustomer: Viewer = {
    type: "customer",
    id: "c1",
    email: "free@techinject.design",
    isPremium: false,
  };
  const premiumCustomer: Viewer = {
    type: "customer",
    id: "c2",
    email: "premium@techinject.design",
    isPremium: true,
  };
  const admin: Viewer = { type: "admin" };

  it("1. Signed-out users can ONLY access published free components", () => {
    expect(canAccess(signedOut, freePublished)).toBe(true);
    expect(canAccess(signedOut, premiumPublished)).toBe(false);
    expect(canAccess(signedOut, freeDraft)).toBe(false);
    expect(canAccess(signedOut, premiumDraft)).toBe(false);
    expect(canAccess(signedOut, freeUnpublished)).toBe(false);
    expect(canAccess(signedOut, premiumUnpublished)).toBe(false);
  });

  it("2. Free customers CANNOT access premium published components or drafts", () => {
    expect(canAccess(freeCustomer, freePublished)).toBe(true);
    expect(canAccess(freeCustomer, premiumPublished)).toBe(false);
    expect(canAccess(freeCustomer, freeDraft)).toBe(false);
    expect(canAccess(freeCustomer, premiumDraft)).toBe(false);
  });

  it("3. Premium customers can access published free & premium components, but NEVER drafts/unpublished", () => {
    expect(canAccess(premiumCustomer, freePublished)).toBe(true);
    expect(canAccess(premiumCustomer, premiumPublished)).toBe(true);
    expect(canAccess(premiumCustomer, freeDraft)).toBe(false);
    expect(canAccess(premiumCustomer, premiumDraft)).toBe(false);
    expect(canAccess(premiumCustomer, freeUnpublished)).toBe(false);
    expect(canAccess(premiumCustomer, premiumUnpublished)).toBe(false);
  });

  it("4. Instant Premium Revocation Blocks Access immediately", async () => {
    const cust = await repository.getCustomerByEmail(
      "premium@techinject.design",
    );
    expect(cust).not.toBeNull();

    await repository.updateCustomerPremiumStatus(cust!.id, false);
    const updatedCust = await repository.getCustomerById(cust!.id);
    expect(updatedCust?.isPremium).toBe(false);

    const revokedViewer: Viewer = {
      type: "customer",
      id: updatedCust!.id,
      email: updatedCust!.email,
      isPremium: updatedCust!.isPremium,
    };

    expect(canAccess(revokedViewer, premiumPublished)).toBe(false);
  });

  it("5. Unpublishing a component renders direct routes and manifests inaccessible", async () => {
    const comp = await repository.getComponentBySlug("button");
    expect(comp).not.toBeNull();

    await repository.updateComponentStatus(comp!.id, "unpublished");
    const unpublishedComp = await repository.getComponentById(comp!.id);

    const target: TargetComponent = {
      slug: unpublishedComp!.slug,
      accessLevel: unpublishedComp!.accessLevel,
      status: unpublishedComp!.status,
    };

    expect(canAccess(signedOut, target)).toBe(false);
    expect(canAccess(freeCustomer, target)).toBe(false);
    expect(canAccess(premiumCustomer, target)).toBe(false);
  });

  it("6. CLI Path Containment prevents escape", () => {
    const root = "/tmp/consumer-app";
    expect(() => verifyPathContainment(root, "src/../../hacked.ts")).toThrow(
      /traversal/,
    );
    expect(() => verifyPathContainment(root, "/etc/shadow")).toThrow(
      /Absolute/,
    );
    expect(() => verifyPathContainment(root, "foo\0bar.ts")).toThrow(
      /null byte/,
    );
  });
});
