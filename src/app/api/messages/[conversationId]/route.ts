import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, conversations } from '@/db/schema/messages';
import { eq, desc, and, or } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/requireUser';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await requireUser();
    const { conversationId } = params;

    // Verify user has access to this conversation
    const conversation = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          or(
            eq(conversations.userId, user.id),
            eq(conversations.participantId, user.id)
          )
        )
      )
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get messages for this conversation
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));

    return NextResponse.json(conversationMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await requireUser();
    const { conversationId } = params;
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          or(
            eq(conversations.userId, user.id),
            eq(conversations.participantId, user.id)
          )
        )
      )
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create new message
    const newMessage = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: user.id,
        text: text.trim(),
        isRead: false,
      })
      .returning();

    // Update conversation's last message and unread count
    if (conversation[0] && newMessage[0]) {
      const currentConversation = conversation[0];
      const currentMessage = newMessage[0];
      
      await db
        .update(conversations)
        .set({
          lastMessageId: currentMessage.id,
          unreadCount: currentConversation.participantId === user.id ? 
            (currentConversation.unreadCount || 0) + 1 : 
            currentConversation.unreadCount || 0,
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, conversationId));
    }

    return NextResponse.json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
