CREATE TABLE "roadmap" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'planned' NOT NULL,
	"priority" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"isPublic" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "app_user" ALTER COLUMN "passwordHash" SET NOT NULL;