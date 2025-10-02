import React from "react";
import { Users, MapPin, Star, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  location: string;
  rating: number;
  gearCount: number;
  followers: number;
  verified: boolean;
}

interface PeopleResultsProps {
  users: User[];
  searchQuery: string;
}

export function PeopleResults({ users, searchQuery }: PeopleResultsProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No people found</h3>
        <p className="text-muted-foreground max-w-sm">
          {searchQuery 
            ? `No results for "${searchQuery}" in people.`
            : "No people available to search."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    {user.verified && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{user.username}</p>
                  <p className="text-sm text-gray-500 mb-2">{user.bio}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {user.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {user.gearCount} gear
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {user.followers} followers
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
