CREATE TABLE "name_suggestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name_suggestion" text NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now()
);
