import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema/messages';
import { profiles } from '@/db/schema/user';
import { rentalRequests } from '@/db/schema/rental';
import { eq, desc, and, or } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/requireUser';

export async function GET() {
  try {
    const user = await requireUser();
    
    // Get all conversations for the current user
    const userConversations = await db
      .select({
        id: conversations.id,
        participantId: conversations.participantId,
        lastMessageId: conversations.lastMessageId,
        unreadCount: conversations.unreadCount,
        updatedAt: conversations.updatedAt,
        participant: {
          id: profiles.id,
          name: profiles.fullName,
          username: profiles.username,
          avatar: profiles.avatarUrl,
          isVerified: profiles.isVerified,
          isOnline: profiles.isOnline,
        },
        lastMessage: {
          id: messages.id,
          text: messages.text,
          timestamp: messages.createdAt,
          isRead: messages.isRead,
          senderId: messages.senderId,
        },
        rentalRequest: {
          id: rentalRequests.id,
          gearName: rentalRequests.gearName,
          status: rentalRequests.status,
          totalCost: rentalRequests.totalCost,
        },
      })
      .from(conversations)
      .leftJoin(profiles, eq(conversations.participantId, profiles.id))
      .leftJoin(messages, eq(conversations.lastMessageId, messages.id))
      .leftJoin(rentalRequests, eq(conversations.rentalRequestId, rentalRequests.id))
      .where(
        or(
          eq(conversations.userId, user.id),
          eq(conversations.participantId, user.id)
        )
      )
      .orderBy(desc(conversations.updatedAt));

    return NextResponse.json(userConversations);
  } catch (error: unknown) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const { userId, gearId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await db
      .select()
      .from(conversations)
      .where(
        and(
          or(
            and(eq(conversations.userId, user.id), eq(conversations.participantId, userId)),
            and(eq(conversations.userId, userId), eq(conversations.participantId, user.id))
          )
        )
      )
      .limit(1);

    if (existingConversation.length > 0) {
      return NextResponse.json(existingConversation[0]);
    }

    // Create new conversation
    const newConversation = await db
      .insert(conversations)
      .values({
        userId: user.id,
        participantId: userId,
        rentalRequestId: gearId ? gearId : null,
        unreadCount: 0,
      })
      .returning();

    return NextResponse.json(newConversation[0]);
  } catch (error: unknown) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
