import { useState, useMemo } from "react";
import Header from "@/components/Header";
import VendorCard, { type Vendor } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  SlidersHorizontal,
  Grid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extended mock data for discovery page
const allVendors: Vendor[] = [
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
    location: "5th Ave & Main St",
    specialties: ["Fish Tacos", "Carnitas", "Vegetarian", "Salsa Verde"],
    isFavorite: false,
  },
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
    location: "Central Park West",
    specialties: ["Espresso", "Cold Brew", "Croissants", "Organic"],
    isFavorite: true,
  },
  {
    id: "3",
    name: "Handmade Jewelry Co.",
    description:
      "Unique handcrafted jewelry and accessories. Each piece is carefully made with love and attention to detail.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    category: "retail",
    rating: 4.9,
    reviewCount: 45,
    priceRange: "$$",
    distance: "0.6 mi",
    isOpen: true,
    openUntil: "6:00 PM",
    location: "Arts District Plaza",
    specialties: ["Silver", "Handmade", "Custom Orders", "Eco-friendly"],
    isFavorite: false,
  },
  {
    id: "4",
    name: "Bangkok Street Kitchen",
    description:
      "Authentic Thai street food with bold flavors and fresh ingredients. Family recipes from Bangkok.",
    image:
      "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.7,
    reviewCount: 203,
    priceRange: "$$",
    distance: "0.8 mi",
    isOpen: false,
    location: "Food Truck Alley",
    specialties: ["Pad Thai", "Som Tam", "Mango Sticky Rice", "Spicy"],
    isFavorite: false,
  },
  {
    id: "5",
    name: "Fresh Juice Bar",
    description:
      "Cold-pressed juices, smoothies, and healthy snacks made with organic fruits and vegetables.",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop",
    category: "drinks",
    rating: 4.5,
    reviewCount: 67,
    priceRange: "$$",
    distance: "1.1 mi",
    isOpen: true,
    openUntil: "7:00 PM",
    location: "Wellness Plaza",
    specialties: ["Green Juice", "Protein Smoothies", "Organic", "Vegan"],
    isFavorite: false,
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
    location: "Music Row",
    specialties: ["Rock", "Jazz", "Rare Finds", "Collectibles"],
    isFavorite: true,
  },
];

const categories = ["all", "food", "drinks", "retail", "services"];
const priceRanges = ["$", "$$", "$$$"];
const sortOptions = [
  { value: "distance", label: "Distance" },
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "alphabetical", label: "A-Z" },
];

const Discover = () => {
  const [vendors, setVendors] = useState(allVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState([5]);
  const [sortBy, setSortBy] = useState("distance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter((vendor) => {
      // Search query filter
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

      // Category filter
      if (selectedCategory !== "all" && vendor.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (
        selectedPriceRanges.length > 0 &&
        !selectedPriceRanges.includes(vendor.priceRange)
      ) {
        return false;
      }

      // Open only filter
      if (showOpenOnly && !vendor.isOpen) {
        return false;
      }

      // Distance filter
      const distance = parseFloat(vendor.distance.split(" ")[0]);
      if (distance > maxDistance[0]) {
        return false;
      }

      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "distance":
        default:
          return parseFloat(a.distance) - parseFloat(b.distance);
      }
    });

    return filtered;
  }, [
    vendors,
    searchQuery,
    selectedCategory,
    selectedPriceRanges,
    showOpenOnly,
    maxDistance,
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Vendors</h1>
          <p className="text-slate-600">
            Find amazing street vendors in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search vendors, food, or specialties..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
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

            {/* Distance */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Distance: {maxDistance[0]} mi
              </label>
              <Slider
                value={maxDistance}
                onValueChange={setMaxDistance}
                max={10}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Open Now */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Availability
              </label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-now"
                  checked={showOpenOnly}
                  onCheckedChange={(checked) =>
                    setShowOpenOnly(checked as boolean)
                  }
                />
                <label htmlFor="open-now" className="text-sm">
                  Open now only
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-3 block">Sort By</label>
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
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {filteredVendors.length} vendors found
            </h2>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedPriceRanges.length > 0 ||
              showOpenOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedPriceRanges([]);
                  setShowOpenOnly(false);
                  setMaxDistance([5]);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
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
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPriceRanges([]);
                setShowOpenOnly(false);
              }}
            >
              Clear all filters
            </Button>
          </div>
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
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onToggleFavorite={handleToggleFavorite}
                className={cn(
                  "animate-fade-in",
                  viewMode === "list" && "flex-row",
                )}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredVendors.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Vendors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
