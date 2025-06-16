import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  DollarSign,
  Heart,
  Phone,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SimpleMapProps {
  vendors: MapVendor[];
  selectedVendor: MapVendor | null;
  onVendorSelect: (vendor: MapVendor | null) => void;
}

const categoryColors = {
  food: "bg-red-500",
  drinks: "bg-amber-500",
  retail: "bg-purple-500",
  services: "bg-blue-500",
};

const SimpleMap = ({
  vendors,
  selectedVendor,
  onVendorSelect,
}: SimpleMapProps) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={
            'w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23cbd5e1" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
          }
        />
      </div>

      {/* Street Grid */}
      <div className="absolute inset-0">
        {/* Horizontal Streets */}
        {[20, 40, 60, 80].map((y) => (
          <div
            key={y}
            className="absolute w-full h-0.5 bg-slate-300 opacity-40"
            style={{ top: `${y}%` }}
          />
        ))}
        {/* Vertical Streets */}
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
      {vendors.map((vendor, index) => {
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
        const isSelected = selectedVendor?.id === vendor.id;

        return (
          <div
            key={vendor.id}
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
            {/* Marker Pin */}
            <div className={cn("relative", isSelected && "animate-bounce")}>
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                  categoryColors[vendor.category],
                  !vendor.isOpen && "grayscale opacity-60",
                )}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
              {/* Pin Point */}
              <div
                className={cn(
                  "w-2 h-2 rounded-full mx-auto -mt-1 border border-white shadow-sm",
                  categoryColors[vendor.category],
                  !vendor.isOpen && "grayscale opacity-60",
                )}
              />
              {/* Status Indicator */}
              {vendor.isOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full animate-pulse" />
              )}
            </div>

            {/* Vendor Name Label */}
            {isSelected && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-md shadow-lg border text-xs font-medium whitespace-nowrap animate-fade-in">
                {vendor.name}
              </div>
            )}
          </div>
        );
      })}

      {/* Selected Vendor Details Panel */}
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
                  onClick={() => onVendorSelect(null)}
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
                    <span className="font-medium">{selectedVendor.rating}</span>
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
                    <span>{selectedVendor.phone}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
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

      {/* Google Maps Notice */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-amber-100 border border-amber-300 rounded-lg px-4 py-2 shadow-sm">
          <p className="text-sm text-amber-800">
            📍 Demo Mode - Interactive visual map (Google Maps loading...)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
