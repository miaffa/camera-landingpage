CREATE TABLE "comment_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"commentId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_post_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."post_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;