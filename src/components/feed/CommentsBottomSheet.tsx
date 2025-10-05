"use client";

import React, { useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentsList } from "./CommentsList";
import { PostWithAuthor } from "@/lib/types/posts";

interface CommentsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostWithAuthor | null;
  onComment?: (postId: string) => void;
}

export function CommentsBottomSheet({ isOpen, onClose, post, onComment }: CommentsBottomSheetProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sheet is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[80vh] flex flex-col">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Comments</h2>
            <span className="text-sm text-gray-500">({post.commentsCount})</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Comments Content - Scrollable Area */}
        <div className="flex-1 min-h-0 overflow-y-auto relative">
          <div className="px-4 py-2">
            <CommentsList postId={post.id} onComment={onComment} />
          </div>
          {/* Scroll fade indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  );
}
