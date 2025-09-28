"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

interface CommentsModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onUserClick: (username: string) => void;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  is_liked: boolean;
  likes_count: number;
}

export default function CommentsModal({ postId, isOpen, onClose, onUserClick }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Load comments when modal opens
  const loadComments = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement comments API
      console.log('Loading comments for post:', postId);
      
      // Mock data for now
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Amazing shot! What camera did you use?',
          createdAt: new Date().toISOString(),
          user: {
            id: '1',
            username: 'photographer1',
            full_name: 'John Doe',
            avatar_url: null,
          },
          is_liked: false,
          likes_count: 2,
        },
        {
          id: '2',
          content: 'Love the composition! 🔥',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: {
            id: '2',
            username: 'creator2',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
          is_liked: true,
          likes_count: 5,
        },
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId, loadComments]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Implement comment submission API
      console.log('Submitting comment:', newComment);
      
      // Mock comment creation
      const mockComment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: 'current-user',
          username: 'you',
          full_name: 'You',
          avatar_url: null,
        },
        is_liked: false,
        likes_count: 0,
      };
      
      setComments(prev => [...prev, mockComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      // TODO: Implement comment like API
      console.log('Liking comment:', commentId);
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              is_liked: !comment.is_liked,
              likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1
            }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Comments</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8 cursor-pointer" onClick={() => onUserClick(comment.user.username)}>
                    <AvatarImage src={comment.user.avatar_url || ''} alt={comment.user.username} />
                    <AvatarFallback>
                      {comment.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUserClick(comment.user.username)}
                        className="font-semibold text-sm hover:opacity-70"
                      >
                        {comment.user.username}
                      </button>
                      <span className="text-gray-500 text-xs">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs ${
                          comment.is_liked ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${comment.is_liked ? 'fill-current' : ''}`} />
                        {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="pt-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim() || isSubmitting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
