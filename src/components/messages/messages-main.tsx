"use client";

import { useState } from 'react';
import MessagesInbox from './messages-inbox';
import ChatInterface from './chat-interface';

// Sample conversation data
const sampleConversation = {
  id: '1',
  participant: {
    name: 'Alex Rivera',
    avatar: '/placeholder.svg',
    initials: 'A',
    online: true
  },
  rentalRequest: {
    gearName: 'Canon EOS R5',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=150&fit=crop&crop=center',
    status: 'approved',
    date: '9/25/2025',
    location: 'Downtown Coffee Shop',
    price: '$225'
  },
  messages: [
    {
      id: '1',
      text: 'Hi! Your rental request has been approved.',
      timestamp: '08:52 AM',
      isOwn: false
    },
    {
      id: '2',
      text: 'Great! When can I pick it up?',
      timestamp: '09:22 AM',
      isOwn: true
    },
    {
      id: '3',
      text: 'Canon R5 pickup confirmed',
      timestamp: '09:50 AM',
      isOwn: false
    }
  ]
};

export default function MessagesMain() {
  const [currentView, setCurrentView] = useState<'inbox' | 'chat'>('inbox');
  const [selectedConversation, setSelectedConversation] = useState<typeof sampleConversation | null>(null);

  const handleConversationSelect = (conversation: any) => {
    // Map the inbox conversation to the chat conversation format
    const chatConversation = {
      ...sampleConversation,
      participant: {
        ...sampleConversation.participant,
        name: conversation.participant.name,
        initials: conversation.participant.initials
      },
      rentalRequest: {
        ...sampleConversation.rentalRequest,
        gearName: conversation.rentalRequest.gearName,
        status: conversation.rentalRequest.status
      }
    };
    
    setSelectedConversation(chatConversation);
    setCurrentView('chat');
  };

  const handleBackToInbox = () => {
    setCurrentView('inbox');
    setSelectedConversation(null);
  };

  if (currentView === 'chat' && selectedConversation) {
    return (
      <ChatInterface 
        conversation={selectedConversation} 
        onBack={handleBackToInbox} 
      />
    );
  }

  return (
    <MessagesInbox onConversationSelect={handleConversationSelect} />
  );
}
