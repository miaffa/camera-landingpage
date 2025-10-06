import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Global connection cache
declare global {
  var __db: ReturnType<typeof drizzle> | undefined;
  var __client: postgres.Sql | undefined;
  var __dbInitialized: boolean | undefined;
}

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

// Create optimized database connection with proper singleton pattern
const createDatabaseConnection = () => {
  // Return existing connection if available
  if (global.__db && global.__client && global.__dbInitialized) {
    return { db: global.__db, client: global.__client };
  }

  const connectionString = getConnectionString();
  const client = postgres(connectionString, {
    max: 3, // Very conservative connection pool
    idle_timeout: 3, // Close idle connections quickly
    connect_timeout: 2, // Fast connection timeout
    prepare: false, // Disable prepared statements for better performance
    transform: {
      undefined: null, // Transform undefined to null for better compatibility
    },
    // Add connection pooling optimizations
    max_lifetime: 60 * 15, // 15 minutes max connection lifetime
    onnotice: () => {}, // Disable notices to reduce noise
  });

  const db = drizzle(client, { schema });

  // Cache the connection globally
  global.__db = db;
  global.__client = client;
  global.__dbInitialized = true;

  console.log("✅ Database connection initialized successfully");
  
  return { db, client };
};

const { db } = createDatabaseConnection();
export { db };