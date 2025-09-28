"use client";

// import { useState } from 'react'; // TODO: Implement state management
import Image from 'next/image';
import { ArrowLeft, Phone, MoreVertical, Camera, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Sample data matching the second image
// const sampleConversation = {
//   id: '1',
//   participant: {
//     name: 'Alex Rivera',
//     avatar: '/placeholder.svg',
//     initials: 'A',
//     online: true
//   },
//   rentalRequest: {
//     gearName: 'Canon EOS R5',
//     image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=150&fit=crop&crop=center',
//     status: 'approved',
//     date: '9/25/2025',
//     location: 'Downtown Coffee Shop',
//     price: '$225'
//   },
//   messages: [
//     {
//       id: '1',
//       text: 'Hi! Your rental request has been approved.',
//       timestamp: '08:52 AM',
//       isOwn: false
//     },
//     {
//       id: '2',
//       text: 'Great! When can I pick it up?',
//       timestamp: '09:22 AM',
//       isOwn: true
//     },
//     {
//       id: '3',
//       text: 'Canon R5 pickup confirmed',
//       timestamp: '09:50 AM',
//       isOwn: false
//     }
//   ]
// };

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    initials: string;
    online: boolean;
  };
  rentalRequest?: {
    gearName: string;
    image: string;
    status: string;
    date: string;
    location: string;
    price: string;
  };
  messages: Array<{
    id: string;
    text: string;
    timestamp: string;
    isOwn: boolean;
  }>;
}

interface ChatInterfaceProps {
  conversation: Conversation;
  onBack: () => void;
}

// Chat Header Component
function ChatHeader({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={conversation.participant.avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {conversation.participant.initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-bold text-sm text-black">{conversation.participant.name}</h2>
            <p className="text-xs text-gray-500">
              {conversation.participant.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-600">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Rental Request Summary Card
function RentalRequestCard({ rentalRequest }: { rentalRequest: Conversation['rentalRequest'] }) {
  return (
    <div className="mx-4 my-4 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden relative">
          <Image
            src={rentalRequest?.image || '/placeholder.svg'}
            alt={rentalRequest?.gearName || 'Gear image'}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-sm text-black">{rentalRequest?.gearName}</span>
            <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
              {rentalRequest?.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{rentalRequest?.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{rentalRequest?.location}</span>
            </div>
            <span className="ml-auto font-bold text-black">{rentalRequest?.price}</span>
          </div>
        </div>
      </div>
      
      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium">
        Confirm Pickup
      </Button>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: Conversation['messages'][0] }) {
  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          message.isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-black'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${
          message.isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

// Main Chat Interface Component
export default function ChatInterface({ conversation, onBack }: ChatInterfaceProps) {
  return (
    <div className="bg-white">
      <ChatHeader conversation={conversation} onBack={onBack} />
      
      <RentalRequestCard rentalRequest={conversation.rentalRequest} />
      
      <div className="px-4 pb-20">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
