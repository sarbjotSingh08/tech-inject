import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes("sample-123456")) {
    // If no real Neon database URL is set, return memory client proxy or throw explanatory error
    console.warn(
      "[DB] DATABASE_URL is not set or using placeholder. In-memory storage will be used by memory repository fallback.",
    );
    return null;
  }

  const sql = neon(databaseUrl);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

export * from "./schema";
export * from "./auth";
export * from "./memory-store";
