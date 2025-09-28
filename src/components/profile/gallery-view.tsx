'use client';

import Image from 'next/image';
import { Grid, Heart, MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample gallery data - only posts
const sampleGallery = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    likes: 24,
    comments: 8,
    caption: 'Beautiful sunset shot with my Canon R5',
    date: '2 days ago',
    location: 'Central Park, NY'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop',
    likes: 12,
    comments: 3,
    caption: 'Street photography in Brooklyn',
    date: '1 week ago',
    location: 'Brooklyn, NY'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    likes: 45,
    comments: 12,
    caption: 'Drone footage from the rooftop',
    date: '2 weeks ago',
    location: 'Manhattan, NY'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop',
    likes: 8,
    comments: 2,
    caption: 'Golden hour portrait session',
    date: '3 weeks ago',
    location: 'Home Studio'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    likes: 67,
    comments: 15,
    caption: 'Behind the scenes of a photoshoot',
    date: '1 month ago',
    location: 'Studio, NY'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop',
    likes: 19,
    comments: 5,
    caption: 'Urban exploration in the city',
    date: '1 month ago',
    location: 'Downtown'
  }
];

export default function GalleryView() {

  return (
    <div className="pb-20">

      {/* Gallery Content - Instagram-style Grid */}
      <div className="grid grid-cols-3 gap-1">
        {sampleGallery.map((item) => (
          <div key={item.id} className="aspect-square bg-gray-100 overflow-hidden relative group">
            <Image
              src={item.image}
              alt={item.caption}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button size="sm" variant="secondary">
                  <Heart className="w-3 h-3" />
                  <span className="ml-1">{item.likes}</span>
                </Button>
                <Button size="sm" variant="secondary">
                  <MessageCircle className="w-3 h-3" />
                  <span className="ml-1">{item.comments}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sampleGallery.length === 0 && (
        <div className="text-center py-12">
          <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">Start sharing your photos and experiences</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        </div>
      )}
    </div>
  );
}
