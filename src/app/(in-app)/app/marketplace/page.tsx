"use client";

import React, { useState } from "react";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FocusTabs } from "@/components/marketplace/FocusTabs";
import { CategoryPills } from "@/components/marketplace/CategoryPills";
import { GearResults } from "@/components/marketplace/GearResults";
import { PeopleResults } from "@/components/marketplace/PeopleResults";
import { LocationFilter } from "@/components/marketplace/LocationFilter";
import { mockGear, mockUsers } from "@/lib/data/marketplace-data";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState<"gear" | "people">("gear");

  // Filter gear based on selected category and search
  const filteredGear = mockGear.filter(gear => {
    const matchesCategory = selectedCategory === "all" || gear.category === selectedCategory;
    const matchesSearch = gear.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Show focus tabs only when there's a search query
  const showFocusTabs = searchQuery.length > 0;

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and rent camera gear from local creators
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Focus Tabs */}
      <FocusTabs 
        searchFocus={searchFocus} 
        onFocusChange={setSearchFocus} 
        showTabs={showFocusTabs} 
      />

      {/* Category Pills */}
      <CategoryPills 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
        showPills={!showFocusTabs || searchFocus === "gear"} 
      />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {searchFocus === "gear" ? filteredGear.length : filteredUsers.length} {searchFocus === "gear" ? "items" : "people"} found
      </div>

      {/* Location Filter */}
      <LocationFilter />

      {/* Results */}
      {searchFocus === "gear" ? (
        <GearResults 
          gear={filteredGear} 
          searchQuery={searchQuery} 
          selectedCategory={selectedCategory} 
        />
      ) : (
        <PeopleResults 
          users={filteredUsers} 
          searchQuery={searchQuery} 
        />
      )}
    </div>
  );
}
