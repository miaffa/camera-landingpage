import {
  boolean,
  timestamp,
  pgTable,
  text,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const gearListings = pgTable("gear_listing", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Basic Info
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  condition: text("condition").notNull(),
  
  // Location
  location: text("location"),
  
  // Availability
  availableFrom: timestamp("available_from", { mode: "date" }),
  availableUntil: timestamp("available_until", { mode: "date" }),
  isAvailable: boolean("is_available").default(true),
  
  // Images
  images: text("images").array(), // Array of image URLs
  
  // Owner
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const gearSaves = pgTable("gear_saves", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gearId: text("gear_id")
    .notNull()
    .references(() => gearListings.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.gearId] }),
}));

export type GearListing = typeof gearListings.$inferSelect;
export type NewGearListing = typeof gearListings.$inferInsert;
export type GearSave = typeof gearSaves.$inferSelect;
export type NewGearSave = typeof gearSaves.$inferInsert;
