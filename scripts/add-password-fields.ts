import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function addPasswordFields() {
  try {
    console.log("Adding password fields to app_user table...");
    
    // Add passwordHash column if it doesn't exist
    await db.execute(sql`ALTER TABLE app_user ADD COLUMN IF NOT EXISTS passwordHash text;`);
    console.log("✓ Added passwordHash column");
    
    // Add passwordSetAt column if it doesn't exist
    await db.execute(sql`ALTER TABLE app_user ADD COLUMN IF NOT EXISTS passwordSetAt timestamp;`);
    console.log("✓ Added passwordSetAt column");
    
    console.log("✅ Password fields added successfully!");
  } catch (error) {
    console.error("❌ Error adding password fields:", error);
  }
}

addPasswordFields();
