import { type Vendor } from "@/components/VendorCard";

export interface FavoriteVendor extends Vendor {
  favoriteDate: string;
  lastVisited?: string;
  visitCount: number;
  notifications: boolean;
  tags: string[];
}

export const favoriteVendors: FavoriteVendor[] = [
  {
    id: "2",
    name: "Joe's Coffee Cart",
    description:
      "Artisan coffee and fresh pastries to fuel your morning. Premium beans roasted locally every week.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    category: "drinks",
    rating: 4.6,
    reviewCount: 89,
    priceRange: "$$",
    distance: "0.4 mi",
    isOpen: true,
    openUntil: "2:00 PM",
    location: "Central Park West & 66th St",
    specialties: ["Espresso", "Cold Brew", "Croissants", "Organic"],
    isFavorite: true,
    favoriteDate: "2024-01-01",
    lastVisited: "2024-01-15",
    visitCount: 12,
    notifications: true,
    tags: ["morning coffee", "work break"],
  },
  {
    id: "6",
    name: "Vintage Vinyl Records",
    description:
      "Rare and vintage vinyl records, music memorabilia, and high-quality turntables for collectors.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    category: "retail",
    rating: 4.8,
    reviewCount: 34,
    priceRange: "$$$",
    distance: "1.3 mi",
    isOpen: true,
    openUntil: "8:00 PM",
    location: "Greenwich Village - MacDougal St",
    specialties: ["Rock", "Jazz", "Rare Finds", "Collectibles"],
    isFavorite: true,
    favoriteDate: "2023-12-15",
    lastVisited: "2024-01-10",
    visitCount: 5,
    notifications: false,
    tags: ["music", "weekends"],
  },
  {
    id: "1",
    name: "Maria's Tacos",
    description:
      "Authentic Mexican street tacos made with fresh ingredients and family recipes passed down for generations.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.8,
    reviewCount: 127,
    priceRange: "$",
    distance: "0.2 mi",
    isOpen: true,
    openUntil: "9:00 PM",
    location: "5th Ave & 42nd St",
    specialties: ["Fish Tacos", "Carnitas", "Vegetarian", "Salsa Verde"],
    isFavorite: true,
    favoriteDate: "2023-11-20",
    lastVisited: "2024-01-12",
    visitCount: 8,
    notifications: true,
    tags: ["lunch", "mexican food"],
  },
];
