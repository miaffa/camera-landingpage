import { pgTable, text, timestamp, uuid, integer, boolean, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const rentalRequests = pgTable('rental_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  gearId: uuid('gear_id').notNull(),
  renterId: uuid('renter_id').notNull(),
  ownerId: uuid('owner_id').notNull(),
  gearName: text('gear_name').notNull(),
  gearImage: text('gear_image'),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('pending'), // pending, approved, rejected, picked_up, dropped_off, completed, cancelled
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  pickupLocation: text('pickup_location'),
  deliveryAddress: text('delivery_address'),
  deliveryRequested: boolean('delivery_requested').default(false),
  pickupConfirmedByOwner: boolean('pickup_confirmed_by_owner').default(false),
  pickupConfirmedByRenter: boolean('pickup_confirmed_by_renter').default(false),
  dropoffConfirmedByOwner: boolean('dropoff_confirmed_by_owner').default(false),
  dropoffConfirmedByRenter: boolean('dropoff_confirmed_by_renter').default(false),
  pickupTime: timestamp('pickup_time'),
  dropoffTime: timestamp('dropoff_time'),
  pickupImageUrl: text('pickup_image_url'),
  dropoffImageUrl: text('dropoff_image_url'),
  renterIdVerified: boolean('renter_id_verified').default(false),
  renterCardVerified: boolean('renter_card_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rentalPayments = pgTable('rental_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  rentalRequestId: uuid('rental_request_id').notNull().references(() => rentalRequests.id),
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').notNull().default('usd'),
  platformFeeCents: integer('platform_fee_cents').notNull(),
  ownerAmountCents: integer('owner_amount_cents').notNull(),
  status: text('status').notNull().default('pending'), // pending, completed, failed, refunded
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeTransferId: text('stripe_transfer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  rentalRequestId: uuid('rental_request_id').notNull().references(() => rentalRequests.id),
  ratedBy: uuid('rated_by').notNull(),
  ratedUser: uuid('rated_user').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  review: text('review'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const rentalRequestsRelations = relations(rentalRequests, ({ one, many }) => ({
  gear: one(gear, {
    fields: [rentalRequests.gearId],
    references: [gear.id],
  }),
  renter: one(profiles, {
    fields: [rentalRequests.renterId],
    references: [profiles.id],
  }),
  owner: one(profiles, {
    fields: [rentalRequests.ownerId],
    references: [profiles.id],
  }),
  payments: many(rentalPayments),
  ratings: many(ratings),
}));

export const rentalPaymentsRelations = relations(rentalPayments, ({ one }) => ({
  rentalRequest: one(rentalRequests, {
    fields: [rentalPayments.rentalRequestId],
    references: [rentalRequests.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  rentalRequest: one(rentalRequests, {
    fields: [ratings.rentalRequestId],
    references: [rentalRequests.id],
  }),
  ratedByUser: one(profiles, {
    fields: [ratings.ratedBy],
    references: [profiles.id],
  }),
  ratedUser: one(profiles, {
    fields: [ratings.ratedUser],
    references: [profiles.id],
  }),
}));

// Import other schemas for relations
import { profiles } from './user';
import { gear } from './gear';
