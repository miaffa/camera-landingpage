import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Export all schemas
export * from "./schema/user";
export * from "./schema/plans";
export * from "./schema/contact";
export * from "./schema/waitlist";
// export * from "./schema/roadmap";
export * from "./schema/coupons";
export * from "./schema/name-suggestions";
export * from "./schema/paypal";
export * from "./schema/posts";
export * from "./schema/gear";
export * from "./schema/messages";
export * from "./schema/rental";