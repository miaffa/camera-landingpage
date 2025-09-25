'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Camera, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import RentalRequestModal from '@/components/gear/rental-request-modal';

interface GearItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number;
  owner: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
  availability: string[];
  isAvailable: boolean;
}

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'cameras', name: 'Cameras' },
  { id: 'lenses', name: 'Lenses' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'audio', name: 'Audio' },
  { id: 'drones', name: 'Drones' },
  { id: 'accessories', name: 'Accessories' },
];

const conditions = [
  { id: 'all', name: 'All Conditions' },
  { id: 'excellent', name: 'Excellent' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample gear data
  useEffect(() => {
    const sampleGear: GearItem[] = [
      {
        id: '1',
        name: 'Canon EOS R5',
        description: 'Professional full-frame mirrorless camera with 45MP sensor',
        price: 150,
        images: ['https://images.unsplash.com/photo-1510125594112-y6937f649492?w=400&h=300&fit=crop'],
        category: 'cameras',
        condition: 'excellent',
        location: {
          address: 'Downtown, New York',
          lat: 40.7589,
          lng: -73.9851,
        },
        distance: 2.5,
        owner: {
          id: 'user1',
          name: 'Alex Rodriguez',
          username: 'alex_rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          rating: 4.9,
          reviewCount: 127,
          isVerified: true,
        },
        availability: ['2024-01-20', '2024-01-21', '2024-01-22'],
        isAvailable: true,
      },
      {
        id: '2',
        name: 'Sony 24-70mm f/2.8 GM',
        description: 'Professional zoom lens with exceptional sharpness',
        price: 75,
        images: ['https://images.unsplash.com/photo-1516035069371-89a142294198?w=400&h=300&fit=crop'],
        category: 'lenses',
        condition: 'excellent',
        location: {
          address: 'Brooklyn, New York',
          lat: 40.6892,
          lng: -73.9442,
        },
        distance: 5.2,
        owner: {
          id: 'user2',
          name: 'Sarah Wilson',
          username: 'sarah_wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          rating: 4.8,
          reviewCount: 89,
          isVerified: true,
        },
        availability: ['2024-01-18', '2024-01-19', '2024-01-20'],
        isAvailable: true,
      },
      {
        id: '3',
        name: 'DJI Mavic Air 2',
        description: 'Compact drone with 4K video and 34-minute flight time',
        price: 100,
        images: ['https://images.unsplash.com/photo-1507646871106-f5978cd457d6?w=400&h=300&fit=crop'],
        category: 'drones',
        condition: 'good',
        location: {
          address: 'Queens, New York',
          lat: 40.7282,
          lng: -73.7949,
        },
        distance: 8.7,
        owner: {
          id: 'user3',
          name: 'Mike Chen',
          username: 'mike_chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 4.7,
          reviewCount: 56,
          isVerified: false,
        },
        availability: ['2024-01-25', '2024-01-26', '2024-01-27'],
        isAvailable: true,
      },
    ];

    setGear(sampleGear);
    setIsLoading(false);
  }, []);

  const filteredGear = gear.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesDistance = item.distance <= maxDistance;
    const matchesAvailability = item.isAvailable;

    return matchesSearch && matchesCategory && matchesCondition && 
           matchesPrice && matchesDistance && matchesAvailability;
  });

  const sortedGear = [...filteredGear].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'distance':
        return a.distance - b.distance;
      case 'rating':
        return b.owner.rating - a.owner.rating;
      default:
        return 0;
    }
  });

  const handleGearClick = (gearItem: GearItem) => {
    setSelectedGear(gearItem);
  };

  const handleRequestSent = (request: any) => {
    console.log('Rental request sent:', request);
    setSelectedGear(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gear...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-black mb-4">Discover Gear</h1>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for cameras, lenses, drones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-4">Filters</h3>
            
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium text-black mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Distance */}
              <div>
                <Label className="text-sm font-medium text-black mb-2 block">
                  Max Distance: {maxDistance} miles
                </Label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={(value) => setMaxDistance(value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Condition */}
              <div>
                <Label className="text-sm font-medium text-black mb-2 block">
                  Condition
                </Label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <Label className="text-sm font-medium text-black mb-2 block">
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              {sortedGear.length} gear items found
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Gear Grid/List */}
          {sortedGear.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No gear found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {sortedGear.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleGearClick(item)}
                >
                  <CardContent className="p-4">
                    <div className={viewMode === 'grid' ? '' : 'flex gap-4'}>
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className={viewMode === 'grid' ? 'w-full h-48 object-cover rounded-lg mb-4' : 'w-24 h-24 object-cover rounded-lg'}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-black">{item.name}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            ${item.price}/day
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{item.distance} miles away</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={item.owner.avatar} />
                              <AvatarFallback className="bg-gray-200 text-xs">
                                {item.owner.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{item.owner.name}</span>
                            {item.owner.isVerified && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {item.owner.rating} ({item.owner.reviewCount})
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rental Request Modal */}
      {selectedGear && (
        <RentalRequestModal
          isOpen={!!selectedGear}
          onClose={() => setSelectedGear(null)}
          gear={selectedGear}
          onRequestSent={handleRequestSent}
        />
      )}
    </div>
  );
}
