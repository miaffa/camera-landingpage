import { timestamp, pgTable, text, serial } from "drizzle-orm/pg-core";

export const nameSuggestions = pgTable("name_suggestions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  nameSuggestion: text("nameSuggestion").notNull(),
  reason: text("reason"), // Optional reason for the name
  instagram: text("instagram"), // Optional Instagram handle
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
