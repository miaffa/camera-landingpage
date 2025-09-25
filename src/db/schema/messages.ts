import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  participantId: uuid('participant_id').notNull(),
  rentalRequestId: uuid('rental_request_id'),
  lastMessageId: uuid('last_message_id'),
  unreadCount: integer('unread_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
  senderId: uuid('sender_id').notNull(),
  text: text('text'),
  imageUrl: text('image_url'),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  fileType: text('file_type'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(profiles, {
    fields: [conversations.userId],
    references: [profiles.id],
  }),
  participant: one(profiles, {
    fields: [conversations.participantId],
    references: [profiles.id],
  }),
  lastMessage: one(messages, {
    fields: [conversations.lastMessageId],
    references: [messages.id],
  }),
  messages: many(messages),
  rentalRequest: one(rentalRequests, {
    fields: [conversations.rentalRequestId],
    references: [rentalRequests.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(profiles, {
    fields: [messages.senderId],
    references: [profiles.id],
  }),
}));

// Import other schemas for relations
import { profiles } from './user';
import { rentalRequests } from './rental';
