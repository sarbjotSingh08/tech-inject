import { pgTable, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const components = pgTable("components", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  accessLevel: text("access_level", { enum: ["free", "premium"] })
    .notNull()
    .default("free"),
  status: text("status", { enum: ["draft", "published", "unpublished"] })
    .notNull()
    .default("draft"),
  currentVersionId: text("current_version_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const componentVersions = pgTable("component_versions", {
  id: text("id").primaryKey(),
  componentId: text("component_id")
    .notNull()
    .references(() => components.id),
  version: text("version").notNull(),
  bundleJson: jsonb("bundle_json").notNull(),
  bundleHash: text("bundle_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  premiumGrantedAt: timestamp("premium_granted_at"),
  premiumRevokedAt: timestamp("premium_revoked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const accessTokens = pgTable("access_tokens", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  name: text("name").notNull().default("CLI Token"),
  hashedToken: text("hashed_token").notNull().unique(),
  revokedAt: timestamp("revoked_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});
