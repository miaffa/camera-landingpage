// Mock feed data
export const mockStories = [
  {
    id: "1",
    name: "Your Story",
    avatar: "/placeholder-avatar.jpg",
    isOwn: true,
    hasNewStory: false
  },
  {
    id: "2",
    name: "landen",
    avatar: "/placeholder-avatar.jpg",
    isOwn: false,
    hasNewStory: true
  },
  {
    id: "3",
    name: "sarah_miller",
    avatar: "/placeholder-avatar.jpg",
    isOwn: false,
    hasNewStory: true
  },
  {
    id: "4",
    name: "mike_johnson",
    avatar: "/placeholder-avatar.jpg",
    isOwn: false,
    hasNewStory: false
  },
  {
    id: "5",
    name: "alex_chen",
    avatar: "/placeholder-avatar.jpg",
    isOwn: false,
    hasNewStory: true
  }
];

export const mockPosts = [
  {
    id: "1",
    author: {
      name: "landen",
      username: "@landen",
      avatar: "/placeholder-avatar.jpg",
      location: "Current Location"
    },
    timestamp: "2 hours ago",
    content: "Captured this incredible action shot during the game today. The Canon R5's autofocus was absolutely flawless! 📸",
    hashtags: ["#sports", "#canonr5", "#photography", "#action"],
    likes: 47,
    comments: 12,
    image: "/placeholder-post.jpg",
    gearUsed: [
      {
        id: "1",
        name: "Canon EOS R5",
        price: 150,
        category: "camera",
        status: "Available",
        rating: 4.9,
        image: "/placeholder-gear.jpg",
        location: "Louisville, KY"
      },
      {
        id: "2",
        name: "Canon RF 70-200mm f/2.8L IS USM",
        price: 85,
        category: "lens",
        status: "Available",
        rating: 4.8,
        image: "/placeholder-gear.jpg",
        location: "Louisville, KY"
      }
    ]
  },
  {
    id: "2",
    author: {
      name: "Sarah Miller",
      username: "@sarah_miller",
      avatar: "/placeholder-avatar.jpg",
      location: "Studio Downtown"
    },
    timestamp: "5 hours ago",
    content: "Portrait session magic! The Sony A7IV with this lighting setup creates the most beautiful skin tones. Available for rent! ✨",
    hashtags: ["#portrait", "#sonya7iv", "#studio", "#lighting"],
    likes: 23,
    comments: 8,
    image: "/placeholder-post.jpg",
    gearUsed: [
      {
        id: "3",
        name: "Sony A7IV",
        price: 120,
        category: "camera",
        status: "Available",
        rating: 4.7,
        image: "/placeholder-gear.jpg",
        location: "Louisville, KY"
      },
      {
        id: "4",
        name: "Godox AD600 Pro",
        price: 65,
        category: "lighting",
        status: "Available",
        rating: 4.6,
        image: "/placeholder-gear.jpg",
        location: "Louisville, KY"
      }
    ]
  },
  {
    id: "3",
    author: {
      name: "Mike Johnson",
      username: "@mike_johnson",
      avatar: "/placeholder-avatar.jpg",
      location: "Outdoor Location"
    },
    timestamp: "1 day ago",
    content: "Golden hour landscape photography never gets old. This Nikon D850 setup captured every detail perfectly! 🌅",
    hashtags: ["#landscape", "#nikond850", "#goldenhour", "#nature"],
    likes: 34,
    comments: 15,
    image: "/placeholder-post.jpg",
    gearUsed: [
      {
        id: "5",
        name: "Nikon D850",
        price: 140,
        category: "camera",
        status: "Available",
        rating: 4.8,
        image: "/placeholder-gear.jpg",
        location: "Louisville, KY"
      },
      {
        id: "6",
        name: "Nikon 24-70mm f/2.8E ED VR",
        price: 75,
        category: "lens",
        status: "Available",
        rating: 4.9,
        image: "/placeholder-gear.jpg",
        location: "Louisville, KY"
      }
    ]
  }
];
