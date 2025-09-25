'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, MapPin, DollarSign, Star, Camera, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface GearItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  availability: 'available' | 'rented' | 'maintenance' | 'hidden';
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  specifications: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalRentals: number;
    totalEarnings: number;
    averageRating: number;
    reviewCount: number;
  };
}

const categories = [
  { id: 'cameras', name: 'Cameras' },
  { id: 'lenses', name: 'Lenses' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'audio', name: 'Audio' },
  { id: 'drones', name: 'Drones' },
  { id: 'accessories', name: 'Accessories' },
];

const conditions = [
  { id: 'excellent', name: 'Excellent', color: 'bg-green-100 text-green-800' },
  { id: 'good', name: 'Good', color: 'bg-blue-100 text-blue-800' },
  { id: 'fair', name: 'Fair', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'poor', name: 'Poor', color: 'bg-red-100 text-red-800' },
];

const availabilityStatuses = [
  { id: 'available', name: 'Available', color: 'bg-green-100 text-green-800' },
  { id: 'rented', name: 'Rented', color: 'bg-blue-100 text-blue-800' },
  { id: 'maintenance', name: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'hidden', name: 'Hidden', color: 'bg-gray-100 text-gray-800' },
];

export default function GearManagement() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [filteredGear, setFilteredGear] = useState<GearItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample gear data
  useEffect(() => {
    const sampleGear: GearItem[] = [
      {
        id: '1',
        name: 'Canon EOS R5',
        description: 'Professional full-frame mirrorless camera with 45MP sensor',
        category: 'cameras',
        price: 150,
        images: ['https://images.unsplash.com/photo-1510125594112-y6937f649492?w=400&h=300&fit=crop'],
        condition: 'excellent',
        availability: 'available',
        location: {
          address: 'Downtown, New York',
          lat: 40.7589,
          lng: -73.9851,
        },
        specifications: {
          sensor: '45MP Full-Frame',
          video: '8K RAW',
          iso: '100-51200',
          weight: '650g',
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        stats: {
          totalRentals: 23,
          totalEarnings: 3450,
          averageRating: 4.9,
          reviewCount: 18,
        },
      },
      {
        id: '2',
        name: 'Sony 24-70mm f/2.8 GM',
        description: 'Professional zoom lens with exceptional sharpness',
        category: 'lenses',
        price: 75,
        images: ['https://images.unsplash.com/photo-1516035069371-89a142294198?w=400&h=300&fit=crop'],
        condition: 'excellent',
        availability: 'rented',
        location: {
          address: 'Brooklyn, New York',
          lat: 40.6892,
          lng: -73.9442,
        },
        specifications: {
          focalLength: '24-70mm',
          aperture: 'f/2.8',
          weight: '886g',
          filterSize: '82mm',
        },
        isActive: true,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        stats: {
          totalRentals: 15,
          totalEarnings: 1125,
          averageRating: 4.8,
          reviewCount: 12,
        },
      },
    ];

    setGear(sampleGear);
    setFilteredGear(sampleGear);
    setIsLoading(false);
  }, []);

  // Filter and sort gear
  useEffect(() => {
    let filtered = gear.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.availability === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'earnings':
          return b.stats.totalEarnings - a.stats.totalEarnings;
        case 'rentals':
          return b.stats.totalRentals - a.stats.totalRentals;
        case 'rating':
          return b.stats.averageRating - a.stats.averageRating;
        default:
          return 0;
      }
    });

    setFilteredGear(filtered);
  }, [gear, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleToggleActive = (gearId: string) => {
    setGear(prev => 
      prev.map(item => 
        item.id === gearId 
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );
  };

  const handleDeleteGear = (gearId: string) => {
    if (confirm('Are you sure you want to delete this gear item?')) {
      setGear(prev => prev.filter(item => item.id !== gearId));
    }
  };

  const getConditionColor = (condition: string) => {
    return conditions.find(c => c.id === condition)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return availabilityStatuses.find(s => s.id === status)?.color || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gear...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Gear Management</h2>
          <p className="text-gray-600">Manage your rental equipment</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Gear
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-black">{gear.length}</p>
              </div>
              <Camera className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-black">
                  {gear.filter(g => g.availability === 'available').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-black">
                  ${gear.reduce((sum, g) => sum + g.stats.totalEarnings, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-black">
                  {gear.length > 0 ? (gear.reduce((sum, g) => sum + g.stats.averageRating, 0) / gear.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Label className="text-sm text-gray-600 mb-2 block">Search</Label>
              <Input
                placeholder="Search gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="min-w-48">
              <Label className="text-sm text-gray-600 mb-2 block">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-48">
              <Label className="text-sm text-gray-600 mb-2 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {availabilityStatuses.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-48">
              <Label className="text-sm text-gray-600 mb-2 block">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                  <SelectItem value="rentals">Rentals</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gear List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGear.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className={getStatusColor(item.availability)}>
                  {availabilityStatuses.find(s => s.id === item.availability)?.name}
                </Badge>
                <Badge className={getConditionColor(item.condition)}>
                  {conditions.find(c => c.id === item.condition)?.name}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-black">{item.name}</h3>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(item.id)}
                  >
                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedGear(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteGear(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-semibold text-black">${item.price}/day</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Rentals</span>
                  <span className="text-black">{item.stats.totalRentals}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Earnings</span>
                  <span className="text-black">${item.stats.totalEarnings}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-black">{item.stats.averageRating}</span>
                    <span className="text-sm text-gray-500">({item.stats.reviewCount})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGear.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No gear found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or add new gear</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Gear
          </Button>
        </div>
      )}
    </div>
  );
}
