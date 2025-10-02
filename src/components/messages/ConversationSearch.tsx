import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConversationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ConversationSearch({ searchQuery, onSearchChange }: ConversationSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search conversations..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
