ALTER TABLE "app_user" ALTER COLUMN "passwordHash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "location" text;