// Centralized mock data for the application

export const mockUsers = [
  { id: "1", name: "John Doe", username: "@john_doe", avatar: "/placeholder-avatar.jpg" },
  { id: "2", name: "Sarah Miller", username: "@sarah_miller", avatar: "/placeholder-avatar.jpg" },
  { id: "3", name: "Mike Johnson", username: "@mike_johnson", avatar: "/placeholder-avatar.jpg" },
];

export const mockGear = [
  { id: "1", name: "Canon EOS R5", price: 150, category: "camera", image: "/placeholder-gear.jpg" },
  { id: "2", name: "Sony A7IV", price: 120, category: "camera", image: "/placeholder-gear.jpg" },
  { id: "3", name: "Canon RF 70-200mm f/2.8L", price: 85, category: "lens", image: "/placeholder-gear.jpg" },
];

export const mockCategories = [
  { id: "1", name: "Cameras", icon: "📷", count: 24 },
  { id: "2", name: "Lenses", icon: "🔍", count: 18 },
  { id: "3", name: "Lighting", icon: "💡", count: 12 },
  { id: "4", name: "Audio", icon: "🎤", count: 8 },
  { id: "5", name: "Accessories", icon: "🎒", count: 15 },
  { id: "6", name: "Tripods", icon: "📐", count: 6 },
];

export const mockGearListings = [
  {
    id: "1",
    title: "Canon EOS R5 Professional Camera",
    description: "High-resolution mirrorless camera perfect for professional photography",
    category: "Camera",
    status: "Available",
    price: 150,
    rating: 4.9,
    location: "Louisville, KY",
    image: "/placeholder-gear.jpg"
  },
  {
    id: "2", 
    title: "Sony A7IV Mirrorless Camera",
    description: "Versatile full-frame camera with excellent low-light performance",
    category: "Camera",
    status: "Rented",
    price: 120,
    rating: 4.8,
    location: "Louisville, KY",
    image: "/placeholder-gear.jpg"
  },
  {
    id: "3",
    title: "Canon RF 70-200mm f/2.8L IS USM",
    description: "Professional telephoto zoom lens with image stabilization",
    category: "Lens",
    status: "Available",
    price: 85,
    rating: 4.9,
    location: "Louisville, KY",
    image: "/placeholder-gear.jpg"
  },
  {
    id: "4",
    title: "Godox AD600 Pro Studio Flash",
    description: "Powerful studio strobe with wireless control capabilities",
    category: "Lighting",
    status: "Available",
    price: 65,
    rating: 4.7,
    location: "Louisville, KY",
    image: "/placeholder-gear.jpg"
  }
];

export const mockPosts = [
  {
    id: "1",
    likes: 47,
    comments: 12,
    image: "/placeholder-post.jpg"
  },
  {
    id: "2",
    likes: 23,
    comments: 8,
    image: "/placeholder-post.jpg"
  },
  {
    id: "3",
    likes: 34,
    comments: 15,
    image: "/placeholder-post.jpg"
  },
  {
    id: "4",
    likes: 18,
    comments: 6,
    image: "/placeholder-post.jpg"
  },
  {
    id: "5",
    likes: 29,
    comments: 11,
    image: "/placeholder-post.jpg"
  },
  {
    id: "6",
    likes: 42,
    comments: 9,
    image: "/placeholder-post.jpg"
  },
  {
    id: "7",
    likes: 15,
    comments: 4,
    image: "/placeholder-post.jpg"
  },
  {
    id: "8",
    likes: 38,
    comments: 13,
    image: "/placeholder-post.jpg"
  },
  {
    id: "9",
    likes: 26,
    comments: 7,
    image: "/placeholder-post.jpg"
  }
];

export const mockSavedItems = [
  {
    id: "1",
    title: "Canon EOS R5",
    owner: "Sarah Miller",
    price: 150,
    image: "/placeholder-gear.jpg"
  },
  {
    id: "2",
    title: "Sony A7IV",
    owner: "Mike Johnson",
    price: 120,
    image: "/placeholder-gear.jpg"
  },
  {
    id: "3",
    title: "Canon RF 70-200mm f/2.8L",
    owner: "Alex Chen",
    price: 85,
    image: "/placeholder-gear.jpg"
  },
  {
    id: "4",
    title: "Godox AD600 Pro",
    owner: "Emma Wilson",
    price: 65,
    image: "/placeholder-gear.jpg"
  },
  {
    id: "5",
    title: "Nikon D850",
    owner: "David Brown",
    price: 140,
    image: "/placeholder-gear.jpg"
  },
  {
    id: "6",
    title: "Sony 24-70mm f/2.8 GM",
    owner: "Lisa Garcia",
    price: 95,
    image: "/placeholder-gear.jpg"
  }
];