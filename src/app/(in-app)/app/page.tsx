"use client";
import React from "react";
import { Home, Camera, Heart, MessageCircle, Share, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="text-muted-foreground text-sm">
            Discover amazing shots and gear from creators
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Stories/Highlights */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-primary">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              {i === 1 && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                  <Plus className="h-3 w-3" />
                </div>
              )}
            </div>
            <span className="text-xs text-center truncate w-full">
              {i === 1 ? "Your Story" : `User ${i}`}
            </span>
          </div>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {/* Sample Post 1 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Post Image Placeholder */}
            <div className="aspect-square bg-muted flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {/* Post Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">John Doe</span> Shot this amazing sunset with my Canon R5 and 24-70mm lens. 
                  Available for rent this weekend! 📸
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">#sunset</Badge>
                  <Badge variant="secondary" className="text-xs">#canonr5</Badge>
                  <Badge variant="secondary" className="text-xs">#photography</Badge>
                </div>
                <p className="text-xs text-muted-foreground">View all 23 comments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Post 2 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Sarah Miller</h3>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Post Image Placeholder */}
            <div className="aspect-square bg-muted flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {/* Post Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Sarah Miller</span> Behind the scenes of my latest portrait session. 
                  This Sony A7IV setup is perfect for studio work! 💫
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">#portrait</Badge>
                  <Badge variant="secondary" className="text-xs">#sonya7iv</Badge>
                  <Badge variant="secondary" className="text-xs">#studio</Badge>
                </div>
                <p className="text-xs text-muted-foreground">View all 12 comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
