'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Filter, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RentalRequestModal from '@/components/gear/rental-request-modal';

interface GearLocation {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  owner: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number;
  isAvailable: boolean;
  availability: string[];
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map] = useState<unknown>(null);
  // const [markers] = useState<unknown[]>([]); // TODO: Implement map markers
  const [selectedGear, setSelectedGear] = useState<GearLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gearLocations, setGearLocations] = useState<GearLocation[]>([]);

  // Sample gear locations
  useEffect(() => {
    const sampleGear: GearLocation[] = [
      {
        id: '1',
        name: 'Canon EOS R5',
        price: 150,
        images: ['https://images.unsplash.com/photo-1510125594112-y6937f649492?w=400&h=300&fit=crop'],
        category: 'cameras',
        condition: 'excellent',
        owner: {
          id: 'user1',
          name: 'Alex Rodriguez',
          username: 'alex_rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          rating: 4.9,
          reviewCount: 127,
          isVerified: true,
        },
        location: {
          address: 'Downtown, New York',
          lat: 40.7589,
          lng: -73.9851,
        },
        distance: 2.5,
        isAvailable: true,
        availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
      {
        id: '2',
        name: 'Sony 24-70mm f/2.8 GM',
        price: 75,
        images: ['https://images.unsplash.com/photo-1516035069371-89a142294198?w=400&h=300&fit=crop'],
        category: 'lenses',
        condition: 'excellent',
        owner: {
          id: 'user2',
          name: 'Sarah Wilson',
          username: 'sarah_wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          rating: 4.8,
          reviewCount: 89,
          isVerified: true,
        },
        location: {
          address: 'Brooklyn, New York',
          lat: 40.6892,
          lng: -73.9442,
        },
        distance: 5.2,
        isAvailable: true,
        availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      },
      {
        id: '3',
        name: 'DJI Mavic Air 2',
        price: 100,
        images: ['https://images.unsplash.com/photo-1507646871106-f5978cd457d6?w=400&h=300&fit=crop'],
        category: 'drones',
        condition: 'good',
        owner: {
          id: 'user3',
          name: 'Mike Chen',
          username: 'mike_chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 4.7,
          reviewCount: 56,
          isVerified: false,
        },
        location: {
          address: 'Queens, New York',
          lat: 40.7282,
          lng: -73.7949,
        },
        distance: 8.7,
        isAvailable: true,
        availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
    ];

    setGearLocations(sampleGear);
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      // This would initialize a real map (Mapbox, Google Maps, etc.)
      // For now, we'll create a placeholder
      const mapElement = mapRef.current;
      mapElement.innerHTML = `
        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
          <div class="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Map will be loaded here</p>
            <p className="text-sm text-gray-500">Integrate with Mapbox or Google Maps</p>
          </div>
        </div>
      `;
    }
  }, [map]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleGearClick = (gear: GearLocation) => {
    setSelectedGear(gear);
  };

  const handleRequestSent = (request: unknown) => {
    console.log('Rental request sent:', request);
    setSelectedGear(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cameras': return '📷';
      case 'lenses': return '🔍';
      case 'lighting': return '💡';
      case 'audio': return '🎤';
      case 'drones': return '🚁';
      case 'accessories': return '🔧';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cameras': return 'bg-blue-100 text-blue-800';
      case 'lenses': return 'bg-green-100 text-green-800';
      case 'lighting': return 'bg-yellow-100 text-yellow-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'drones': return 'bg-red-100 text-red-800';
      case 'accessories': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGear = gearLocations.filter(gear =>
    gear.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gear.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-black">Gear Map</h1>
          {userLocation && (
            <Badge className="bg-green-100 text-green-800">
              <Navigation className="w-3 h-3 mr-1" />
              Location Found
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search gear or owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="outline" className="bg-white shadow-lg">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white shadow-lg">
              <ZoomOut className="w-4 h-4" />
            </Button>
            {userLocation && (
              <Button size="sm" variant="outline" className="bg-white shadow-lg">
                <Navigation className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Gear List Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-black mb-4">
              Nearby Gear ({filteredGear.length})
            </h3>
            
            <div className="space-y-3">
              {filteredGear.map((gear) => (
                <Card
                  key={gear.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleGearClick(gear)}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={gear.images[0]}
                        alt={gear.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-black truncate">{gear.name}</h4>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ${gear.price}/day
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getCategoryIcon(gear.category)}</span>
                          <Badge className={getCategoryColor(gear.category)}>
                            {gear.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{gear.distance} miles</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={gear.owner.avatar} />
                            <AvatarFallback className="bg-gray-200 text-xs">
                              {gear.owner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">{gear.owner.name}</span>
                          {gear.owner.isVerified && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">✓</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredGear.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No gear found nearby</p>
              </div>
            )}
          </div>
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