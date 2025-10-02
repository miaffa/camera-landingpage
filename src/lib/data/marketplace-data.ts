import { Camera, Monitor, Zap, Mic, Video, Headphones } from "lucide-react";

// Category data
export const categories = [
  { id: "all", name: "All", icon: Camera },
  { id: "camera", name: "Camera", icon: Camera },
  { id: "lenses", name: "Lenses", icon: Camera },
  { id: "monitors", name: "Monitors", icon: Monitor },
  { id: "lighting", name: "Lighting", icon: Zap },
  { id: "audio", name: "Audio", icon: Mic },
  { id: "video", name: "Video", icon: Video },
  { id: "accessories", name: "Accessories", icon: Headphones },
];

// Mock gear data
export const mockGear = [
  {
    id: "1",
    title: "Canon EOS R5",
    price: 150,
    category: "camera",
    status: "Available",
    rating: 4.8,
    image: "/placeholder-gear.jpg",
    location: "Louisville, KY"
  },
  {
    id: "2",
    title: "Sony 24-70mm f/2.8 GM",
    price: 75,
    category: "lenses",
    status: "Available",
    rating: 4.9,
    image: "/placeholder-gear.jpg",
    location: "Louisville, KY"
  },
  {
    id: "3",
    title: "Atomos Ninja V",
    price: 45,
    category: "monitors",
    status: "Available",
    rating: 4.7,
    image: "/placeholder-gear.jpg",
    location: "Louisville, KY"
  },
  {
    id: "4",
    title: "Godox AD600 Pro",
    price: 65,
    category: "lighting",
    status: "Available",
    rating: 4.6,
    image: "/placeholder-gear.jpg",
    location: "Louisville, KY"
  }
];

// Mock user data
export const mockUsers = [
  {
    id: "1",
    name: "Sarah Miller",
    username: "@sarah_photography",
    bio: "Professional photographer specializing in portraits and events",
    avatar: "/placeholder-avatar.jpg",
    location: "Louisville, KY",
    rating: 4.9,
    gearCount: 12,
    followers: 1200,
    verified: true
  },
  {
    id: "2",
    name: "Mike Johnson",
    username: "@mike_videography",
    bio: "Cinematographer and video production specialist",
    avatar: "/placeholder-avatar.jpg",
    location: "Louisville, KY",
    rating: 4.8,
    gearCount: 8,
    followers: 850,
    verified: false
  },
  {
    id: "3",
    name: "Alex Chen",
    username: "@alex_creates",
    bio: "Content creator and photography enthusiast",
    avatar: "/placeholder-avatar.jpg",
    location: "Louisville, KY",
    rating: 4.7,
    gearCount: 5,
    followers: 420,
    verified: true
  }
];
