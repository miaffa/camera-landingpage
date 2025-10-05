import {
  text,
  timestamp,
  pgTable,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Author information
  authorId: text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Post content
  content: text("content").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  
  // Location (optional)
  location: text("location"),
  
  // User and gear tagging
  taggedUsers: jsonb("taggedUsers").$type<string[]>().default([]),
  taggedGear: jsonb("taggedGear").$type<string[]>().default([]),
  
  // Engagement metrics
  likesCount: integer("likesCount").default(0),
  commentsCount: integer("commentsCount").default(0),
  sharesCount: integer("sharesCount").default(0),
  
  // Visibility and status
  isPublic: boolean("isPublic").default(true),
  isArchived: boolean("isArchived").default(false),
  
  // Timestamps
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const postLikes = pgTable("post_likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  postId: text("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const postComments = pgTable("post_comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  postId: text("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  
  authorId: text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  content: text("content").notNull(),
  parentCommentId: text("parentCommentId"), // For replies
  
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const postSaves = pgTable("post_saves", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  postId: text("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const commentLikes = pgTable("comment_likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  commentId: text("commentId")
    .notNull()
    .references(() => postComments.id, { onDelete: "cascade" }),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

// Type exports
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type PostComment = typeof postComments.$inferSelect;
export type PostSave = typeof postSaves.$inferSelect;
export type CommentLike = typeof commentLikes.$inferSelect;
export type NewCommentLike = typeof commentLikes.$inferInsert;