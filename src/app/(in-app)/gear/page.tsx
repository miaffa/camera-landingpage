"use client";

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock gear data - replace with real data from your API
const mockGear = [
  {
    id: '1',
    name: 'Canon EOS R5',
    category: 'Camera Body',
    price: 150,
    image: '/placeholder.svg',
    location: 'Louisville, KY',
    condition: 'Excellent',
    availability: 'available',
    totalEarnings: 1200,
    totalRentals: 8,
    lastRented: '2 days ago',
    description: 'Professional mirrorless camera with 45MP sensor and 8K video recording.'
  },
  {
    id: '2',
    name: 'Sony 24-70mm f/2.8 GM',
    category: 'Lens',
    price: 85,
    image: '/placeholder.svg',
    location: 'Louisville, KY',
    condition: 'Good',
    availability: 'rented',
    totalEarnings: 680,
    totalRentals: 12,
    lastRented: 'Currently rented',
    description: 'Professional zoom lens with constant f/2.8 aperture throughout the zoom range.'
  },
  {
    id: '3',
    name: 'Godox AD600Pro',
    category: 'Lighting',
    price: 45,
    image: '/placeholder.svg',
    location: 'Louisville, KY',
    condition: 'Excellent',
    availability: 'available',
    totalEarnings: 360,
    totalRentals: 8,
    lastRented: '1 week ago',
    description: 'Professional studio strobe with 600Ws power output and wireless control.'
  }
];

export default function GearManagementPage() {
  const [gear] = useState(mockGear);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGear, setShowAddGear] = useState(false);

  const filteredGear = gear.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.availability === activeTab;
    return matchesSearch && matchesTab;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Gear</h1>
          <p className="text-muted-foreground">
            Manage your camera equipment listings and track earnings
          </p>
        </div>
        <Dialog open={showAddGear} onOpenChange={setShowAddGear}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Gear
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Gear</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Gear Name</label>
                  <Input placeholder="e.g., Canon EOS R5" />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input placeholder="e.g., Camera Body" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price per Day ($)</label>
                  <Input placeholder="150" type="number" />
                </div>
                <div>
                  <label className="text-sm font-medium">Condition</label>
                  <Input placeholder="e.g., Excellent" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Describe your gear..." />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="e.g., Louisville, KY" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddGear(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddGear(false)}>
                  Add Gear
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">$2,240</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Rentals</p>
                <p className="text-2xl font-bold">28</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search your gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Availability
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Gear</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="rented">Rented</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGear.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge className={getAvailabilityColor(item.availability)}>
                      {item.availability}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${item.price}</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getConditionColor(item.condition)}>
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Total Earnings: <span className="font-semibold">${item.totalEarnings}</span></p>
                      <p>Total Rentals: <span className="font-semibold">{item.totalRentals}</span></p>
                      <p>Last Rented: <span className="font-semibold">{item.lastRented}</span></p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
