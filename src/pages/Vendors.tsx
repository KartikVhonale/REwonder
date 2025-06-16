import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import VendorCard, { type Vendor } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Grid,
  List,
  TrendingUp,
  Users,
  Heart,
  Phone,
  Globe,
  Calendar,
  Award,
  Utensils,
  Coffee,
  ShoppingBag,
  DollarSign,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extended vendor data with more details
interface ExtendedVendor extends Vendor {
  website?: string;
  hours?: { [key: string]: string };
  verified: boolean;
  joinedDate: string;
  totalReviews: number;
  recentReviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  photos: string[];
  coordinates?: { lat: number; lng: number };
}

const allVendors: ExtendedVendor[] = [
  {
    id: "1",
    name: "Maria's Tacos",
    description:
      "Authentic Mexican street tacos made with fresh ingredients and family recipes passed down for generations. We pride ourselves on using only the finest ingredients sourced locally.",
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
    isFavorite: false,
    verified: true,
    joinedDate: "2022-03-15",
    totalReviews: 127,
    website: "https://mariasstreettacos.com",
    hours: {
      Monday: "11:00 AM - 9:00 PM",
      Tuesday: "11:00 AM - 9:00 PM",
      Wednesday: "11:00 AM - 9:00 PM",
      Thursday: "11:00 AM - 9:00 PM",
      Friday: "11:00 AM - 10:00 PM",
      Saturday: "10:00 AM - 10:00 PM",
      Sunday: "12:00 PM - 8:00 PM",
    },
    recentReviews: [
      {
        id: "1",
        author: "John D.",
        rating: 5,
        comment:
          "Best tacos in the city! The carnitas are incredible and the salsas are perfectly spiced.",
        date: "2024-01-15",
      },
      {
        id: "2",
        author: "Sarah M.",
        rating: 5,
        comment:
          "Amazing authentic flavors. Maria is so friendly and the prices are great!",
        date: "2024-01-10",
      },
    ],
    photos: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "2",
    name: "Joe's Coffee Cart",
    description:
      "Artisan coffee and fresh pastries to fuel your morning. Premium beans roasted locally every week with sustainable farming practices.",
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
    verified: true,
    joinedDate: "2021-11-08",
    totalReviews: 89,
    hours: {
      Monday: "6:00 AM - 2:00 PM",
      Tuesday: "6:00 AM - 2:00 PM",
      Wednesday: "6:00 AM - 2:00 PM",
      Thursday: "6:00 AM - 2:00 PM",
      Friday: "6:00 AM - 2:00 PM",
      Saturday: "7:00 AM - 3:00 PM",
      Sunday: "Closed",
    },
    recentReviews: [
      {
        id: "1",
        author: "Mike R.",
        rating: 5,
        comment: "Perfect cappuccino every time. Joe knows his coffee!",
        date: "2024-01-12",
      },
    ],
    photos: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "3",
    name: "Handmade Jewelry Co.",
    description:
      "Unique handcrafted jewelry and accessories. Each piece is carefully made with love and attention to detail using ethically sourced materials.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    category: "retail",
    rating: 4.9,
    reviewCount: 45,
    priceRange: "$$",
    distance: "0.6 mi",
    isOpen: true,
    openUntil: "6:00 PM",
    location: "SoHo District - Spring St",
    specialties: ["Silver", "Handmade", "Custom Orders", "Eco-friendly"],
    isFavorite: false,
    verified: true,
    joinedDate: "2023-01-20",
    totalReviews: 45,
    website: "https://handmadejewelryco.com",
    hours: {
      Monday: "10:00 AM - 6:00 PM",
      Tuesday: "10:00 AM - 6:00 PM",
      Wednesday: "10:00 AM - 6:00 PM",
      Thursday: "10:00 AM - 6:00 PM",
      Friday: "10:00 AM - 7:00 PM",
      Saturday: "9:00 AM - 7:00 PM",
      Sunday: "11:00 AM - 5:00 PM",
    },
    recentReviews: [
      {
        id: "1",
        author: "Emma L.",
        rating: 5,
        comment:
          "Beautiful pieces and excellent craftsmanship. Love supporting local artisans!",
        date: "2024-01-08",
      },
    ],
    photos: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "4",
    name: "Bangkok Street Kitchen",
    description:
      "Authentic Thai street food with bold flavors and fresh ingredients. Family recipes from Bangkok brought to the streets of NYC.",
    image:
      "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.7,
    reviewCount: 203,
    priceRange: "$$",
    distance: "0.8 mi",
    isOpen: false,
    location: "Food Truck Alley - 23rd St",
    specialties: ["Pad Thai", "Som Tam", "Mango Sticky Rice", "Spicy"],
    isFavorite: false,
    verified: true,
    joinedDate: "2022-06-12",
    totalReviews: 203,
    hours: {
      Monday: "11:00 AM - 8:00 PM",
      Tuesday: "11:00 AM - 8:00 PM",
      Wednesday: "Closed",
      Thursday: "11:00 AM - 8:00 PM",
      Friday: "11:00 AM - 9:00 PM",
      Saturday: "11:00 AM - 9:00 PM",
      Sunday: "12:00 PM - 7:00 PM",
    },
    recentReviews: [
      {
        id: "1",
        author: "Alex T.",
        rating: 5,
        comment: "Incredible pad thai! Tastes just like the ones in Bangkok.",
        date: "2024-01-14",
      },
    ],
    photos: [
      "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "5",
    name: "Fresh Juice Bar",
    description:
      "Cold-pressed juices, smoothies, and healthy snacks made with organic fruits and vegetables. Supporting your wellness journey.",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop",
    category: "drinks",
    rating: 4.5,
    reviewCount: 67,
    priceRange: "$$",
    distance: "1.1 mi",
    isOpen: true,
    openUntil: "7:00 PM",
    location: "Union Square East",
    specialties: ["Green Juice", "Protein Smoothies", "Organic", "Vegan"],
    isFavorite: false,
    verified: false,
    joinedDate: "2023-09-03",
    totalReviews: 67,
    hours: {
      Monday: "7:00 AM - 7:00 PM",
      Tuesday: "7:00 AM - 7:00 PM",
      Wednesday: "7:00 AM - 7:00 PM",
      Thursday: "7:00 AM - 7:00 PM",
      Friday: "7:00 AM - 8:00 PM",
      Saturday: "8:00 AM - 8:00 PM",
      Sunday: "8:00 AM - 6:00 PM",
    },
    recentReviews: [
      {
        id: "1",
        author: "Lisa K.",
        rating: 4,
        comment: "Love the green juice! Fresh and energizing.",
        date: "2024-01-11",
      },
    ],
    photos: [
      "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "6",
    name: "Vintage Vinyl Records",
    description:
      "Rare and vintage vinyl records, music memorabilia, and high-quality turntables for collectors and music enthusiasts.",
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
    verified: true,
    joinedDate: "2021-12-01",
    totalReviews: 34,
    website: "https://vintagevinylnyc.com",
    hours: {
      Monday: "12:00 PM - 8:00 PM",
      Tuesday: "12:00 PM - 8:00 PM",
      Wednesday: "12:00 PM - 8:00 PM",
      Thursday: "12:00 PM - 8:00 PM",
      Friday: "12:00 PM - 9:00 PM",
      Saturday: "11:00 AM - 9:00 PM",
      Sunday: "12:00 PM - 7:00 PM",
    },
    recentReviews: [
      {
        id: "1",
        author: "Tom B.",
        rating: 5,
        comment: "Found a rare Blue Note pressing here. Great selection!",
        date: "2024-01-09",
      },
    ],
    photos: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    ],
  },
];

const categories = ["all", "food", "drinks", "retail", "services"];
const priceRanges = ["$", "$$", "$$$"];
const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "distance", label: "Nearest" },
  { value: "newest", label: "Newest" },
  { value: "alphabetical", label: "A-Z" },
];

const categoryIcons = {
  food: Utensils,
  drinks: Coffee,
  retail: ShoppingBag,
  services: DollarSign,
};

const Vendors = () => {
  const [vendors, setVendors] = useState(allVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVendor, setSelectedVendor] = useState<ExtendedVendor | null>(
    null,
  );

  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter((vendor) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          vendor.name.toLowerCase().includes(query) ||
          vendor.description.toLowerCase().includes(query) ||
          vendor.specialties.some((specialty) =>
            specialty.toLowerCase().includes(query),
          );
        if (!matchesSearch) return false;
      }

      if (selectedCategory !== "all" && vendor.category !== selectedCategory) {
        return false;
      }

      if (
        selectedPriceRanges.length > 0 &&
        !selectedPriceRanges.includes(vendor.priceRange)
      ) {
        return false;
      }

      if (showOpenOnly && !vendor.isOpen) {
        return false;
      }

      if (showVerifiedOnly && !vendor.verified) {
        return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "newest":
          return (
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
          );
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    vendors,
    searchQuery,
    selectedCategory,
    selectedPriceRanges,
    showOpenOnly,
    showVerifiedOnly,
    sortBy,
  ]);

  const handleToggleFavorite = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, isFavorite: !vendor.isFavorite }
          : vendor,
      ),
    );
  };

  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    setSelectedPriceRanges((prev) =>
      checked
        ? [...prev, priceRange]
        : prev.filter((range) => range !== priceRange),
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPriceRanges([]);
    setShowOpenOnly(false);
    setShowVerifiedOnly(false);
  };

  const VendorDetailModal = ({ vendor }: { vendor: ExtendedVendor }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={vendor.image} alt={vendor.name} />
            <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{vendor.name}</span>
              {vendor.verified && <Award className="h-5 w-5 text-brand-500" />}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{vendor.rating}</span>
                <span>({vendor.totalReviews} reviews)</span>
              </div>
              <Badge
                variant={vendor.isOpen ? "default" : "secondary"}
                className={vendor.isOpen ? "bg-vendor-500" : ""}
              >
                {vendor.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-64 object-cover rounded-lg"
          />

          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-slate-600 text-sm">{vendor.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-1">
              {vendor.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{vendor.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span>{vendor.priceRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>
                Joined {new Date(vendor.joinedDate).toLocaleDateString()}
              </span>
            </div>
            {vendor.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline flex items-center gap-1"
                >
                  Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Hours</h3>
            <div className="space-y-2 text-sm">
              {vendor.hours &&
                Object.entries(vendor.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}</span>
                    <span className="text-slate-600">{hours}</span>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Recent Reviews</h3>
            <div className="space-y-3">
              {vendor.recentReviews.map((review) => (
                <div key={review.id} className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{review.author}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">
                    {review.comment}
                  </p>
                  <span className="text-xs text-slate-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button
              variant="outline"
              onClick={() => handleToggleFavorite(vendor.id)}
              className={vendor.isFavorite ? "text-red-500" : ""}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  vendor.isFavorite && "fill-red-500 text-red-500",
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Vendors</h1>
          <p className="text-slate-600">
            Discover amazing local vendors in your area
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-brand-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{vendors.length}</div>
              <div className="text-sm text-slate-600">Total Vendors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-vendor-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {vendors.filter((v) => v.isOpen).length}
              </div>
              <div className="text-sm text-slate-600">Open Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {vendors.filter((v) => v.verified).length}
              </div>
              <div className="text-sm text-slate-600">Verified</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {(
                  vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
                ).toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search vendors, specialties, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>

            {/* Category Tabs */}
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category === "all" ? "All" : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range
                </label>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox
                        id={range}
                        checked={selectedPriceRanges.includes(range)}
                        onCheckedChange={(checked) =>
                          handlePriceRangeChange(range, checked as boolean)
                        }
                      />
                      <label htmlFor={range} className="text-sm">
                        {range}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Availability
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="open-now"
                      checked={showOpenOnly}
                      onCheckedChange={(checked) =>
                        setShowOpenOnly(checked as boolean)
                      }
                    />
                    <label htmlFor="open-now" className="text-sm">
                      Open now
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified-only"
                      checked={showVerifiedOnly}
                      onCheckedChange={(checked) =>
                        setShowVerifiedOnly(checked as boolean)
                      }
                    />
                    <label htmlFor="verified-only" className="text-sm">
                      Verified only
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">View</label>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="flex-1"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="flex-1"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {filteredVendors.length} vendors found
          </h2>
          <Link to="/map">
            <Button variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </Link>
        </div>

        {/* Results Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No vendors found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search criteria or explore different categories
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6 mb-12",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {filteredVendors.map((vendor) => (
              <Dialog key={vendor.id}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <VendorCard
                      vendor={vendor}
                      onToggleFavorite={handleToggleFavorite}
                      className="hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                </DialogTrigger>
                <VendorDetailModal vendor={vendor} />
              </Dialog>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredVendors.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Vendors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
