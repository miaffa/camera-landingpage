'use client';

import { useState } from 'react';
import { Camera, Plus, Edit, Trash2, Eye, Star, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample gear data
const sampleGear = [
  {
    id: '1',
    name: 'Canon EOS R5',
    category: 'Camera',
    price: 45,
    rating: 4.8,
    reviews: 23,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    status: 'available',
    location: 'New York, NY',
    description: 'Professional mirrorless camera with 45MP sensor'
  },
  {
    id: '2',
    name: 'Sony A7 IV',
    category: 'Camera',
    price: 35,
    rating: 4.9,
    reviews: 18,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    status: 'rented',
    location: 'Los Angeles, CA',
    description: 'Full-frame mirrorless camera with 33MP sensor'
  },
  {
    id: '3',
    name: 'DJI Mavic 3 Pro',
    category: 'Drone',
    price: 60,
    rating: 4.7,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    status: 'available',
    location: 'Chicago, IL',
    description: 'Professional drone with 4K video capabilities'
  }
];

const statusColors = {
  available: 'bg-green-100 text-green-800',
  rented: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  unavailable: 'bg-red-100 text-red-800'
};

export default function GearHubView() {
  const [selectedGear, setSelectedGear] = useState<string | null>(null);

  return (
    <div className="px-4 pb-20">
      {/* Add Gear Button */}
      <div className="flex justify-end mb-4">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Gear
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-black">{sampleGear.length}</div>
          <div className="text-xs text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {sampleGear.filter(g => g.status === 'available').length}
          </div>
          <div className="text-xs text-gray-600">Available</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {sampleGear.filter(g => g.status === 'rented').length}
          </div>
          <div className="text-xs text-gray-600">Rented</div>
        </div>
      </div>

      {/* Gear List */}
      <div className="space-y-4">
        {sampleGear.map((gear) => (
          <Card key={gear.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100">
                  <img
                    src={gear.image}
                    alt={gear.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-black">{gear.name}</h3>
                      <p className="text-sm text-gray-600">{gear.category}</p>
                    </div>
                    <Badge className={statusColors[gear.status as keyof typeof statusColors]}>
                      {gear.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{gear.rating}</span>
                      <span>({gear.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{gear.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-black">
                      ${gear.price}/day
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sampleGear.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No gear yet</h3>
          <p className="text-gray-500 mb-4">Start building your rental inventory</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      )}
    </div>
  );
}
