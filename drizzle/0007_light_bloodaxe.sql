CREATE TABLE "gear_saves" (
	"user_id" text NOT NULL,
	"gear_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "gear_saves_user_id_gear_id_pk" PRIMARY KEY("user_id","gear_id")
);
--> statement-breakpoint
ALTER TABLE "gear_saves" ADD CONSTRAINT "gear_saves_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gear_saves" ADD CONSTRAINT "gear_saves_gear_id_gear_listing_id_fk" FOREIGN KEY ("gear_id") REFERENCES "public"."gear_listing"("id") ON DELETE cascade ON UPDATE no action;