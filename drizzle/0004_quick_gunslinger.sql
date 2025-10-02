ALTER TABLE "app_user" ALTER COLUMN "passwordHash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "taggedUsers" jsonb DEFAULT '[]'::jsonb;