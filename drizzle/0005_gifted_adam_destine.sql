CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"renter_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"gear_id" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"total_days" integer NOT NULL,
	"daily_rate" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"platform_fee" numeric(10, 2) NOT NULL,
	"owner_amount" numeric(10, 2) NOT NULL,
	"renter_amount" numeric(10, 2) NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_transfer_id" text,
	"payment_status" text DEFAULT 'pending',
	"status" text DEFAULT 'pending',
	"status_history" jsonb DEFAULT '[]'::jsonb,
	"renter_message" text,
	"owner_message" text,
	"pickup_location" text,
	"return_location" text,
	"pickup_instructions" text,
	"return_instructions" text,
	"pickup_condition_photos" jsonb DEFAULT '[]'::jsonb,
	"return_condition_photos" jsonb DEFAULT '[]'::jsonb,
	"condition_notes" text,
	"dispute_reason" text,
	"dispute_description" text,
	"dispute_resolution" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"paid_at" timestamp,
	"pickup_at" timestamp,
	"return_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rental_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"gear_id" text NOT NULL,
	"booking_id" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"reason" text DEFAULT 'rental',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"message" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"is_system_message" boolean DEFAULT false,
	"message_type" text DEFAULT 'text',
	"created_at" timestamp DEFAULT now(),
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"reviewee_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"communication_rating" integer,
	"gear_condition_rating" integer,
	"timeliness_rating" integer,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gear_listing" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"price_per_day" numeric(10, 2) NOT NULL,
	"condition" text NOT NULL,
	"location" text,
	"available_from" timestamp,
	"available_until" timestamp,
	"is_available" boolean DEFAULT true,
	"images" text[],
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "app_user" ALTER COLUMN "passwordHash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "stripeConnectAccountId" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "stripeConnectAccountStatus" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "stripeConnectOnboardingComplete" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renter_id_app_user_id_fk" FOREIGN KEY ("renter_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_owner_id_app_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_gear_id_gear_listing_id_fk" FOREIGN KEY ("gear_id") REFERENCES "public"."gear_listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_blocks" ADD CONSTRAINT "rental_blocks_gear_id_gear_listing_id_fk" FOREIGN KEY ("gear_id") REFERENCES "public"."gear_listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_blocks" ADD CONSTRAINT "rental_blocks_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_messages" ADD CONSTRAINT "rental_messages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_messages" ADD CONSTRAINT "rental_messages_sender_id_app_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_app_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewee_id_app_user_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gear_listing" ADD CONSTRAINT "gear_listing_owner_id_app_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;