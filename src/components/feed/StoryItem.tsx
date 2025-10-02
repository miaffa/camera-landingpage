import React from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Story {
  id: string;
  name: string;
  avatar: string;
  isOwn: boolean;
  hasNewStory: boolean;
}

interface StoryItemProps {
  story: Story;
  onClick: (story: Story) => void;
}

export function StoryItem({ story, onClick }: StoryItemProps) {
  return (
    <div 
      className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer"
      onClick={() => onClick(story)}
    >
      <div className="relative">
        <Avatar className={`h-14 w-14 ${story.hasNewStory ? 'ring-2 ring-primary' : ''}`}>
          <AvatarImage src={story.avatar} />
          <AvatarFallback>
            {story.isOwn ? "You" : story.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {story.isOwn && (
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
            <Plus className="h-3 w-3" />
          </div>
        )}
      </div>
      <span className="text-xs text-center truncate w-full">
        {story.name}
      </span>
    </div>
  );
}
