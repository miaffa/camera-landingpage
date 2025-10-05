"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitText?: string;
  initialValue?: string;
  disabled?: boolean;
}

export function CommentInput({ 
  onSubmit, 
  onCancel, 
  placeholder = "Write a comment...", 
  submitText = "Post",
  initialValue = "",
  disabled = false
}: CommentInputProps) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
        disabled={disabled || isSubmitting}
        maxLength={500}
      />
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {content.length}/500 characters
        </div>
        
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting || disabled}
          >
            <Send className="h-4 w-4 mr-1" />
            {isSubmitting ? "Posting..." : submitText}
          </Button>
        </div>
      </div>
    </form>
  );
}
