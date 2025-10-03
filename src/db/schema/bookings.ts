import {
  text,
  timestamp,
  pgTable,
  integer,
  boolean,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { gearListings } from "./gear";

// Rental status enum
export type RentalStatus = 
  | "pending"           // Booking request sent, waiting for owner approval
  | "approved"          // Owner approved, payment required
  | "paid"              // Payment completed, ready for pickup
  | "active"            // Currently being rented
  | "returned"          // Gear returned, waiting for condition verification
  | "completed"         // Rental completed successfully
  | "cancelled"         // Rental cancelled by either party
  | "disputed";         // Rental in dispute

// Rental bookings table
export const bookings = pgTable("bookings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Participants
  renterId: text("renter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  gearId: text("gear_id")
    .notNull()
    .references(() => gearListings.id, { onDelete: "cascade" }),
  
  // Rental details
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  totalDays: integer("total_days").notNull(),
  
  // Pricing
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(), // 10% total (5% each)
  ownerAmount: decimal("owner_amount", { precision: 10, scale: 2 }).notNull(),
  renterAmount: decimal("renter_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Payment information
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeTransferId: text("stripe_transfer_id"), // Transfer to owner
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded, disputed
  
  // Status and workflow
  status: text("status").$type<RentalStatus>().default("pending"),
  statusHistory: jsonb("status_history").$type<Array<{
    status: RentalStatus;
    timestamp: Date;
    note?: string;
  }>>().default([]),
  
  // Communication
  renterMessage: text("renter_message"), // Initial message from renter
  ownerMessage: text("owner_message"),   // Owner's response
  
  // Pickup/Return details
  pickupLocation: text("pickup_location"),
  returnLocation: text("return_location"),
  pickupInstructions: text("pickup_instructions"),
  returnInstructions: text("return_instructions"),
  
  // Condition verification
  pickupConditionPhotos: jsonb("pickup_condition_photos").$type<string[]>().default([]),
  returnConditionPhotos: jsonb("return_condition_photos").$type<string[]>().default([]),
  conditionNotes: text("condition_notes"),
  
  // Dispute information
  disputeReason: text("dispute_reason"),
  disputeDescription: text("dispute_description"),
  disputeResolution: text("dispute_resolution"),
  
  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  approvedAt: timestamp("approved_at", { mode: "date" }),
  paidAt: timestamp("paid_at", { mode: "date" }),
  pickupAt: timestamp("pickup_at", { mode: "date" }),
  returnAt: timestamp("return_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

// Messages table for rental communication
export const rentalMessages = pgTable("rental_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<string[]>().default([]), // Image URLs
  
  isSystemMessage: boolean("is_system_message").default(false),
  messageType: text("message_type").default("text"), // text, image, system
  
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  readAt: timestamp("read_at", { mode: "date" }),
});

// Reviews table for completed rentals
export const reviews = pgTable("reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  
  reviewerId: text("reviewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  revieweeId: text("reviewee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  
  // Specific ratings
  communicationRating: integer("communication_rating"), // 1-5
  gearConditionRating: integer("gear_condition_rating"), // 1-5
  timelinessRating: integer("timeliness_rating"), // 1-5
  
  isPublic: boolean("is_public").default(true),
  
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Rental availability blocks (when gear is unavailable)
export const rentalBlocks = pgTable("rental_blocks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  gearId: text("gear_id")
    .notNull()
    .references(() => gearListings.id, { onDelete: "cascade" }),
  
  bookingId: text("booking_id")
    .references(() => bookings.id, { onDelete: "cascade" }),
  
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  
  reason: text("reason").default("rental"), // rental, maintenance, unavailable
  notes: text("notes"),
  
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Type exports
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type RentalMessage = typeof rentalMessages.$inferSelect;
export type NewRentalMessage = typeof rentalMessages.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type RentalBlock = typeof rentalBlocks.$inferSelect;
export type NewRentalBlock = typeof rentalBlocks.$inferInsert;
