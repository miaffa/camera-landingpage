import { Camera, Video, Mic, Monitor, Zap, Headphones } from "lucide-react";

// Gear categories for listing
export const gearCategories = [
  {
    id: "camera",
    name: "Camera",
    description: "DSLR, Mirrorless, Film cameras",
    icon: Camera,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "video",
    name: "Video Equipment",
    description: "Camcorders, gimbals, lighting",
    icon: Video,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "audio",
    name: "Audio Equipment",
    description: "Microphones, recorders, accessories",
    icon: Mic,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "monitors",
    name: "Monitors & Displays",
    description: "Field monitors, viewfinders",
    icon: Monitor,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "lighting",
    name: "Lighting",
    description: "LED panels, strobes, modifiers",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Tripods, bags, filters",
    icon: Headphones,
    color: "bg-gray-100 text-gray-600"
  }
];
