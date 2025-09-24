import { pgTable, text, timestamp, uuid, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { users } from "./user";
import { posts } from "./posts";

export const gear = pgTable("gear", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // camera, lens, lighting, etc.
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  condition: text("condition").notNull(), // excellent, good, fair
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isAvailable: boolean("is_available").default(true).notNull(),
  images: text("images").array(), // Array of image URLs
  specs: text("specs"), // JSON string of specifications
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const postGear = pgTable("post_gear", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  gearId: uuid("gear_id")
    .notNull()
    .references(() => gear.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gearRentals = pgTable("gear_rentals", {
  id: uuid("id").primaryKey().defaultRandom(),
  gearId: uuid("gear_id")
    .notNull()
    .references(() => gear.id, { onDelete: "cascade" }),
  renterId: uuid("renter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // pending, confirmed, active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
