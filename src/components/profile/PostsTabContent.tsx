import React from "react";
import { Camera, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockPosts } from "@/lib/data/mock-data";

export function PostsTabContent() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {mockPosts.map((post) => (
        <Card key={post.id} className="aspect-square bg-white border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center relative group">
              <Camera className="h-8 w-8 text-gray-400" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-white text-xs">
                  <Heart className="h-3 w-3 fill-white" />
                  {post.likes}
                  <MessageCircle className="h-3 w-3" />
                  {post.comments}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
