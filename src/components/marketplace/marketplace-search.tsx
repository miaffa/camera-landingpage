"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, Camera, User, MapPin, MessageCircle, Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import useSWR from 'swr';

// Types for API data
interface Gear {
  id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string;
  model: string;
  condition: string;
  dailyRate: string;
  weeklyRate: string | null;
  monthlyRate: string | null;
  deposit: string | null;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  isAvailable: boolean;
  images: string[];
  specs: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface GearResponse {
  gear: Gear[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Sample data matching the image - Sigma lenses
// const sampleGear = [
//   {
//     id: '1',
//     name: 'Sigma 70-200 f/2.8',
//     subtitle: 'Sigma 70-200 f/2.8',
//     price: 40,
//     rating: 4.5,
//     image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&crop=center',
//     available: true
//   },
//   {
//     id: '2',
//     name: 'Sigma 24-70 f/2.8',
//     subtitle: 'Sigma 24-70 f/2.8',
//     price: 35,
//     rating: 4.5,
//     image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&crop=center',
//     available: true
//   }
// ];

// Header Component
function MarketplaceHeader() {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-center px-4 py-4">
        <h1 className="text-xl font-bold text-black">Marketplace</h1>
      </div>
    </div>
  );
}

// Main Navigation Tabs
function MainNavigation() {
  const [activeTab, setActiveTab] = useState('gear');

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('gear')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === 'gear'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-black'
          }`}
        >
          <Camera className="w-4 h-4" />
          Gear
        </Button>
        <Button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-black'
          }`}
        >
          <User className="w-4 h-4" />
          Users
        </Button>
      </div>
    </div>
  );
}

// Search Bar Component
function SearchBar() {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search gear..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 text-gray-600"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Category Filters Component
function CategoryFilters() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: Camera },
    { id: 'camera', name: 'Camera', icon: Camera },
    { id: 'lenses', name: 'Lenses', icon: Camera },
    { id: 'media-suites', name: 'Media Suites', icon: Camera }
  ];

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// Results Count Component
function ResultsCount() {
  return (
    <div className="px-4 py-2">
      <p className="text-sm text-gray-600">4 items found</p>
    </div>
  );
}

// Product Card Component
function ProductCard({ gear }: { gear: Gear }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="relative p-3">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 w-6 h-6 text-gray-600"
        >
          <Bookmark className="w-4 h-4" />
        </Button>
        <Badge
          className="absolute top-3 right-3 bg-gray-100 text-gray-700 text-xs px-2 py-1"
        >
          Available
        </Badge>
      </div>

      {/* Product Image */}
      <div className="px-3 pb-3">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
          <Image
            src={gear.images && gear.images.length > 0 ? gear.images[0] : '/placeholder.svg'}
            alt={gear.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-3 pb-3">
        <h3 className="font-bold text-sm text-black mb-1">{gear.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{gear.brand} {gear.model}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-red-500 font-semibold text-sm">${gear.dailyRate}/day</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-600">4.5</span>
          </div>
        </div>
        
        {gear.location && (
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{gear.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Grid Component
function ProductGrid() {
  const { data, error, isLoading } = useSWR<GearResponse>('/api/gear');

  if (isLoading) {
    return (
      <div className="px-4 pb-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gear...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 pb-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load gear</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const gear = data?.gear || [];

  return (
    <div className="px-4 pb-20">
      {gear.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No gear found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {gear.map((item) => (
            <ProductCard key={item.id} gear={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// Bottom Navigation Component
function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-500">
      <div className="flex items-center justify-around py-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 bg-white rounded-full text-blue-500"
        >
          <Search className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 text-white"
        >
          <MapPin className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

// Main Marketplace Search Component
export default function MarketplaceSearch() {
  return (
    <div className="bg-white">
      <MarketplaceHeader />
      <MainNavigation />
      <SearchBar />
      <CategoryFilters />
      <ResultsCount />
      <ProductGrid />
      <BottomNavigation />
    </div>
  );
}
