"use client";

import React from "react";
import { MessageCircle, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground text-sm">
            Chat with gear owners and renters
          </p>
        </div>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      <div className="flex flex-col gap-2">
        {/* Sample conversation 1 */}
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">John Doe</h3>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              Thanks for the quick response! When can I pick up the camera?
            </p>
          </div>
          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            2
          </Badge>
        </div>

        {/* Sample conversation 2 */}
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">Sarah Miller</h3>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              The lens is in perfect condition. Ready for pickup!
            </p>
          </div>
        </div>

        {/* Sample conversation 3 */}
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>MJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">Mike Johnson</h3>
              <span className="text-xs text-muted-foreground">3h ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              Is the tripod still available for this weekend?
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder for empty state */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Start a conversation by booking gear or listing your equipment.
        </p>
      </div>
    </div>
  );
}
