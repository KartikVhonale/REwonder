import { useState, useMemo } from "react";
import Header from "@/components/Header";
import GoogleMapsWrapper from "@/components/GoogleMapsWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MapPin,
  Navigation,
  Star,
  Clock,
  DollarSign,
  Heart,
  Phone,
  Utensils,
  Coffee,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Locate,
  Globe,
  Map as MapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map vendor data with real coordinates (New York City area)
interface MapVendor {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "food" | "drinks" | "retail" | "services";
  rating: number;
  reviewCount: number;
  priceRange: "$" | "$$" | "$$$";
  distance: string;
  isOpen: boolean;
  openUntil?: string;
  location: string;
  specialties: string[];
  coordinates: { lat: number; lng: number };
  phone?: string;
  isFavorite?: boolean;
}

const mapVendors: MapVendor[] = [
  {
    id: "1",
    name: "Maria's Tacos",
    description:
      "Authentic Mexican street tacos made with fresh ingredients and family recipes.",
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
    coordinates: { lat: 40.7527, lng: -73.9772 },
    phone: "(555) 123-4567",
    isFavorite: false,
  },
  {
    id: "2",
    name: "Joe's Coffee Cart",
    description:
      "Artisan coffee and fresh pastries to fuel your morning. Premium beans roasted locally.",
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
    coordinates: { lat: 40.7737, lng: -73.9816 },
    phone: "(555) 234-5678",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Handmade Jewelry Co.",
    description:
      "Unique handcrafted jewelry and accessories. Each piece made with love and attention.",
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
    coordinates: { lat: 40.7241, lng: -74.0018 },
    phone: "(555) 345-6789",
    isFavorite: false,
  },
  {
    id: "4",
    name: "Bangkok Street Kitchen",
    description:
      "Authentic Thai street food with bold flavors and fresh ingredients from Bangkok.",
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
    coordinates: { lat: 40.7394, lng: -73.9891 },
    phone: "(555) 456-7890",
    isFavorite: false,
  },
  {
    id: "5",
    name: "Fresh Juice Bar",
    description:
      "Cold-pressed juices, smoothies, and healthy snacks made with organic ingredients.",
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
    coordinates: { lat: 40.7359, lng: -73.9911 },
    phone: "(555) 567-8901",
    isFavorite: false,
  },
  {
    id: "6",
    name: "Vintage Vinyl Records",
    description:
      "Rare and vintage vinyl records, music memorabilia, and turntables for collectors.",
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
    coordinates: { lat: 40.7282, lng: -74.0013 },
    phone: "(555) 678-9012",
    isFavorite: true,
  },
];

const categoryIcons = {
  food: Utensils,
  drinks: Coffee,
  retail: ShoppingBag,
  services: DollarSign,
};

const categoryColors = {
  food: "bg-red-500",
  drinks: "bg-amber-500",
  retail: "bg-purple-500",
  services: "bg-blue-500",
};

// Visual map component (fallback)
const VisualMap = ({
  vendors,
  selectedVendor,
  onVendorSelect,
  mapZoom,
}: {
  vendors: MapVendor[];
  selectedVendor: MapVendor | null;
  onVendorSelect: (vendor: MapVendor | null) => void;
  mapZoom: number;
}) => {
  const VendorMarker = ({
    vendor,
    index,
  }: {
    vendor: MapVendor;
    index: number;
  }) => {
    const CategoryIcon = categoryIcons[vendor.category];
    const isSelected = selectedVendor?.id === vendor.id;

    // Calculate position based on index for demo
    const positions = [
      { x: 25, y: 30 },
      { x: 60, y: 45 },
      { x: 75, y: 25 },
      { x: 40, y: 70 },
      { x: 80, y: 60 },
      { x: 15, y: 55 },
    ];
    const position = positions[index % positions.length];

    return (
      <div
        className={cn(
          "absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 hover:scale-110",
          isSelected && "scale-125 z-10",
        )}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        onClick={() => onVendorSelect(vendor)}
      >
        <div className={cn("relative", isSelected && "animate-bounce")}>
          <div
            className={cn(
              "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
              categoryColors[vendor.category],
              !vendor.isOpen && "grayscale opacity-60",
            )}
          >
            <CategoryIcon className="w-4 h-4 text-white" />
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full mx-auto -mt-1 border border-white shadow-sm",
              categoryColors[vendor.category],
              !vendor.isOpen && "grayscale opacity-60",
            )}
          />
          {vendor.isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full animate-pulse" />
          )}
        </div>

        {isSelected && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-md shadow-lg border text-xs font-medium whitespace-nowrap animate-fade-in">
            {vendor.name}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
      style={{ transform: `scale(${mapZoom})`, transformOrigin: "center" }}
    >
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={
            'w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23cbd5e1" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
          }
        />
      </div>

      {/* Street Grid */}
      <div className="absolute inset-0">
        {[20, 40, 60, 80].map((y) => (
          <div
            key={y}
            className="absolute w-full h-0.5 bg-slate-300 opacity-40"
            style={{ top: `${y}%` }}
          />
        ))}
        {[20, 40, 60, 80].map((x) => (
          <div
            key={x}
            className="absolute h-full w-0.5 bg-slate-300 opacity-40"
            style={{ left: `${x}%` }}
          />
        ))}
      </div>

      {/* Landmarks */}
      <div className="absolute top-[15%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-300">
          <span className="text-xs font-medium text-green-700 text-center">
            Central
            <br />
            Park
          </span>
        </div>
      </div>

      <div className="absolute bottom-[20%] right-[25%] transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-slate-400">
          <span className="text-xs font-medium text-slate-600 text-center">
            Plaza
          </span>
        </div>
      </div>

      {/* Vendor Markers */}
      {vendors.map((vendor, index) => (
        <VendorMarker key={vendor.id} vendor={vendor} index={index} />
      ))}
    </div>
  );
};

const Map = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<MapVendor | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [vendors, setVendors] = useState(mapVendors);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
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

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(vendor.category)
      ) {
        return false;
      }

      if (showOpenOnly && !vendor.isOpen) {
        return false;
      }

      return true;
    });
  }, [vendors, searchQuery, selectedCategories, showOpenOnly]);

  const handleToggleFavorite = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, isFavorite: !vendor.isFavorite }
          : vendor,
      ),
    );
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    );
  };

  const openDirections = (vendor: MapVendor) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${vendor.coordinates.lat},${vendor.coordinates.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Success Banner */}
      <div className="bg-blue-100 border-b border-blue-200 py-2">
        <div className="container">
          <div className="text-sm text-blue-800 flex items-center gap-2">
            🗺️ Interactive Map with Google Maps Integration!
            <Badge variant="secondary" className="bg-blue-200 text-blue-800">
              {filteredVendors.length} vendors
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              API Key: ✓ Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="relative h-[calc(100vh-120px)] overflow-hidden">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-40 space-y-2">
          {/* Search */}
          <Card className="w-80 shadow-lg">
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Map Type Switcher */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Map Type
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={useGoogleMaps ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseGoogleMaps(true)}
                    className="flex-1"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Google Maps
                  </Button>
                  <Button
                    variant={!useGoogleMaps ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseGoogleMaps(false)}
                    className="flex-1"
                  >
                    <MapIcon className="w-4 h-4 mr-1" />
                    Visual Map
                  </Button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="open-only"
                    checked={showOpenOnly}
                    onCheckedChange={(checked) =>
                      setShowOpenOnly(checked as boolean)
                    }
                  />
                  <label htmlFor="open-only" className="text-sm font-medium">
                    Show open vendors only
                  </label>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Categories</label>
                  {Object.keys(categoryIcons).map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <label htmlFor={category} className="text-sm capitalize">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Map Controls (only show for visual map) */}
          {!useGoogleMaps && (
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-white shadow-lg"
                onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 2))}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-white shadow-lg"
                onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 0.5))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-white shadow-lg"
              >
                <Locate className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 z-40">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold">Legend</h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {Object.entries(categoryIcons).map(([category, Icon]) => (
                <div key={category} className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center",
                      categoryColors[category as keyof typeof categoryColors],
                    )}
                  >
                    <Icon className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-xs capitalize">{category}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs">Open now</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Container */}
        {useGoogleMaps ? (
          <GoogleMapsWrapper
            vendors={filteredVendors}
            selectedVendor={selectedVendor}
            onVendorSelect={setSelectedVendor}
            center={{ lat: 40.7589, lng: -73.9851 }}
            zoom={13}
          />
        ) : (
          <VisualMap
            vendors={filteredVendors}
            selectedVendor={selectedVendor}
            onVendorSelect={setSelectedVendor}
            mapZoom={mapZoom}
          />
        )}

        {/* Vendor Details Panel */}
        {selectedVendor && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96 z-50">
            <Card className="shadow-xl animate-fade-in">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={selectedVendor.image}
                    alt={selectedVendor.name}
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVendor(null)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <Badge
                      variant={selectedVendor.isOpen ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        selectedVendor.isOpen
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-slate-500",
                      )}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedVendor.isOpen
                        ? `Open until ${selectedVendor.openUntil}`
                        : "Closed"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {selectedVendor.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {selectedVendor.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(selectedVendor.id)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          selectedVendor.isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-slate-400",
                        )}
                      />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {selectedVendor.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      <span>{selectedVendor.priceRange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{selectedVendor.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedVendor.location}</span>
                  </div>

                  {selectedVendor.phone && (
                    <div className="flex items-center gap-1 mb-3 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${selectedVendor.phone}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {selectedVendor.phone}
                      </a>
                    </div>
                  )}

                  {selectedVendor.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {selectedVendor.specialties
                          .slice(0, 4)
                          .map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => openDirections(selectedVendor)}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <Badge
            variant="secondary"
            className="bg-white/90 text-slate-700 shadow-lg"
          >
            {filteredVendors.length} vendors found
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Map;
