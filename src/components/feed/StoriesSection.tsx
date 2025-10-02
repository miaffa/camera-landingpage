import React from "react";
import { StoryItem } from "./StoryItem";
import { mockStories } from "@/lib/data/feed-data";

interface Story {
  id: string;
  name: string;
  avatar: string;
  isOwn: boolean;
  hasNewStory: boolean;
}

interface StoriesSectionProps {
  onStoryClick: (story: Story) => void;
}

export function StoriesSection({ onStoryClick }: StoriesSectionProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {mockStories.map((story) => (
        <StoryItem
          key={story.id}
          story={story}
          onClick={onStoryClick}
        />
      ))}
    </div>
  );
}
