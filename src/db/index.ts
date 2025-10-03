import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Try both connection strings for troubleshooting
const getConnectionString = () => {
  const primaryUrl = process.env.DATABASE_URL;
  const fallbackUrl = process.env.DATABASE_URL2;
  
  if (!primaryUrl && !fallbackUrl) {
    throw new Error("Neither DATABASE_URL nor DATABASE_URL2 is set");
  }
  
  if (!primaryUrl) {
    console.log("🔗 Using DATABASE_URL2 (fallback)");
    return fallbackUrl!;
  }
  
  console.log("🔗 Using DATABASE_URL (primary)");
  return primaryUrl;
};

const connectionString = getConnectionString();
const client = postgres(connectionString);
export const db = drizzle(client, { schema });