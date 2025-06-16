import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import VendorCard, { type Vendor } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Heart,
  MapPin,
  Clock,
  Star,
  Grid,
  List,
  Share2,
  Download,
  MoreHorizontal,
  Bell,
  BellOff,
  Navigation,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extended vendor type for favorites with additional metadata
interface FavoriteVendor extends Vendor {
  favoriteDate: string;
  lastVisited?: string;
  visitCount: number;
  notifications: boolean;
  tags: string[];
}

// Mock favorite vendors data
const favoriteVendors: FavoriteVendor[] = [
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

const sortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "visited", label: "Recently Visited" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest" },
  { value: "alphabetical", label: "A-Z" },
];

const categories = ["all", "food", "drinks", "retail", "services"];

const Favorites = () => {
  const [vendors, setVendors] = useState(favoriteVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter((vendor) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          vendor.name.toLowerCase().includes(query) ||
          vendor.description.toLowerCase().includes(query) ||
          vendor.specialties.some((specialty) =>
            specialty.toLowerCase().includes(query),
          ) ||
          vendor.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (selectedCategory !== "all" && vendor.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Sort vendors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.favoriteDate).getTime() -
            new Date(a.favoriteDate).getTime()
          );
        case "visited":
          if (!a.lastVisited && !b.lastVisited) return 0;
          if (!a.lastVisited) return 1;
          if (!b.lastVisited) return -1;
          return (
            new Date(b.lastVisited).getTime() -
            new Date(a.lastVisited).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [vendors, searchQuery, selectedCategory, sortBy]);

  const handleToggleFavorite = (vendorId: string) => {
    setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
  };

  const handleToggleNotifications = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, notifications: !vendor.notifications }
          : vendor,
      ),
    );
  };

  const handleExportFavorites = () => {
    const data = vendors.map((v) => ({
      name: v.name,
      category: v.category,
      location: v.location,
      rating: v.rating,
      favoriteDate: v.favoriteDate,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favorite-vendors.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: vendors.length,
    visited: vendors.filter((v) => v.lastVisited).length,
    withNotifications: vendors.filter((v) => v.notifications).length,
    avgRating: vendors.length
      ? (
          vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
        ).toFixed(1)
      : "0",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-slate-600">
            Your saved vendors and personalized collection
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2 fill-red-500" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-slate-600">Saved Vendors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-brand-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.visited}</div>
              <div className="text-sm text-slate-600">Visited</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Bell className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {stats.withNotifications}
              </div>
              <div className="text-sm text-slate-600">Notifications On</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2 fill-yellow-400" />
              <div className="text-2xl font-bold">{stats.avgRating}</div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {vendors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Start exploring vendors and save your favorites to build your
                personalized collection
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/discover">
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Discover Vendors
                  </Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Browse Map
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search and Filters */}
            <Card className="mb-8">
              <CardContent className="p-6">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search your favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <Tabs
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="food">Food</TabsTrigger>
                        <TabsTrigger value="drinks">Drinks</TabsTrigger>
                      </TabsList>
                    </Tabs>
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
                    <label className="text-sm font-medium mb-2 block">
                      View
                    </label>
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

                  <div>
                    <Button
                      variant="outline"
                      onClick={handleExportFavorites}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredVendors.length} favorites
                  {searchQuery && ` matching "${searchQuery}"`}
                </h2>
                <div className="flex gap-2">
                  <Link to="/map">
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share List
                  </Button>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            {filteredVendors.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No matches found</h3>
                  <p className="text-slate-600">
                    Try adjusting your search or category filter
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {filteredVendors.map((vendor) => (
                  <div key={vendor.id} className="relative">
                    <VendorCard
                      vendor={vendor}
                      onToggleFavorite={handleToggleFavorite}
                      className="hover:shadow-xl transition-all duration-300"
                    />

                    {/* Favorite Metadata Overlay */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleNotifications(vendor.id)}
                          >
                            {vendor.notifications ? (
                              <>
                                <BellOff className="w-4 h-4 mr-2" />
                                Turn off notifications
                              </>
                            ) : (
                              <>
                                <Bell className="w-4 h-4 mr-2" />
                                Turn on notifications
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Navigation className="w-4 h-4 mr-2" />
                            Get directions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share vendor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Additional Info Card */}
                    <Card className="mt-2 bg-gradient-to-r from-slate-50 to-slate-100">
                      <CardContent className="p-3">
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                          <div>
                            <div className="font-medium">Added</div>
                            <div>
                              {new Date(
                                vendor.favoriteDate,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Visits</div>
                            <div>{vendor.visitCount} times</div>
                          </div>
                          {vendor.lastVisited && (
                            <div className="col-span-2">
                              <div className="font-medium">Last visit</div>
                              <div>
                                {new Date(
                                  vendor.lastVisited,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>

                        {vendor.tags.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {vendor.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs">
                            {vendor.notifications ? (
                              <>
                                <Bell className="w-3 h-3 text-blue-500" />
                                <span className="text-blue-600">
                                  Notifications on
                                </span>
                              </>
                            ) : (
                              <>
                                <BellOff className="w-3 h-3 text-slate-400" />
                                <span className="text-slate-500">
                                  Notifications off
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {filteredVendors.length > 0 && (
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-500" />
                    You might also like
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Based on your favorites, here are some similar vendors to
                    explore:
                  </p>
                  <div className="flex gap-2">
                    <Link to="/discover?category=food">
                      <Button variant="outline" size="sm">
                        More Food Vendors
                      </Button>
                    </Link>
                    <Link to="/discover?category=drinks">
                      <Button variant="outline" size="sm">
                        More Coffee Shops
                      </Button>
                    </Link>
                    <Link to="/discover">
                      <Button variant="outline" size="sm">
                        Discover New Vendors
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
