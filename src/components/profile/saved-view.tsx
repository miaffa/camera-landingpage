'use client';

import { useState } from 'react';
import { Bookmark, Heart, MessageCircle, Share2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Sample saved items data - only posts
const sampleSavedItems = [
  {
    id: '1',
    title: 'Sunset Photography Tips',
    description: 'Learn how to capture stunning sunset photos with these pro tips',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    likes: 124,
    comments: 23,
    author: 'Sarah Wilson',
    savedDate: '1 week ago',
    tags: ['photography', 'tips', 'sunset']
  },
  {
    id: '2',
    title: 'Drone Photography Guide',
    description: 'Complete guide to aerial photography with drones',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    likes: 89,
    comments: 15,
    author: 'Alex Rodriguez',
    savedDate: '3 weeks ago',
    tags: ['drone', 'aerial', 'photography']
  },
  {
    id: '3',
    title: 'Portrait Lighting Techniques',
    description: 'Master the art of portrait lighting in any environment',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    likes: 156,
    comments: 28,
    author: 'Emma Thompson',
    savedDate: '1 month ago',
    tags: ['portrait', 'lighting', 'techniques']
  },
  {
    id: '4',
    title: 'Street Photography Composition',
    description: 'Tips for capturing compelling street photography moments',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    likes: 73,
    comments: 12,
    author: 'David Park',
    savedDate: '1 month ago',
    tags: ['street', 'composition', 'urban']
  }
];

export default function SavedView() {
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  const sortedItems = [...sampleSavedItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      case 'oldest':
        return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="px-4 pb-20">
      {/* Sort Button */}
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        <Button
          size="sm"
          variant={sortBy === 'recent' ? 'default' : 'outline'}
          onClick={() => setSortBy('recent')}
        >
          Recent
        </Button>
        <Button
          size="sm"
          variant={sortBy === 'oldest' ? 'default' : 'outline'}
          onClick={() => setSortBy('oldest')}
        >
          Oldest
        </Button>
      </div>

      {/* Saved Items List */}
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                        <Bookmark className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Post info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>by {item.author}</span>
                    </div>
                  </div>
                  
                  {/* Tags and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Saved date */}
                  <div className="text-xs text-gray-500 mt-2">
                    Saved {item.savedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sampleSavedItems.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved posts</h3>
          <p className="text-gray-500 mb-4">Start saving posts you&apos;re interested in</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Explore Posts
          </Button>
        </div>
      )}
    </div>
  );
}
