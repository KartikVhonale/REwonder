import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  DollarSign,
  Utensils,
  ShoppingBag,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Vendor {
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
  isFavorite?: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
  onToggleFavorite?: (vendorId: string) => void;
  className?: string;
}

const categoryIcons = {
  food: Utensils,
  drinks: Coffee,
  retail: ShoppingBag,
  services: DollarSign,
};

const categoryColors = {
  food: "bg-market-100 text-market-700",
  drinks: "bg-amber-100 text-amber-700",
  retail: "bg-purple-100 text-purple-700",
  services: "bg-blue-100 text-blue-700",
};

const VendorCard = ({
  vendor,
  onToggleFavorite,
  className,
}: VendorCardProps) => {
  const CategoryIcon = categoryIcons[vendor.category];

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow duration-300",
        className,
      )}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className={cn("text-xs", categoryColors[vendor.category])}>
            <CategoryIcon className="w-3 h-3 mr-1" />
            {vendor.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite?.(vendor.id)}
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                vendor.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-slate-600",
              )}
            />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge
            variant={vendor.isOpen ? "default" : "secondary"}
            className={cn(
              "text-xs",
              vendor.isOpen
                ? "bg-vendor-500 hover:bg-vendor-600"
                : "bg-slate-500",
            )}
          >
            <Clock className="w-3 h-3 mr-1" />
            {vendor.isOpen ? `Open until ${vendor.openUntil}` : "Closed"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {vendor.name}
            </h3>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
              {vendor.description}
            </p>
          </div>
          <Avatar className="h-10 w-10 ml-3 flex-shrink-0">
            <AvatarImage src={vendor.image} alt={vendor.name} />
            <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{vendor.rating}</span>
            <span>({vendor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{vendor.priceRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{vendor.distance}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3 text-sm text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{vendor.location}</span>
        </div>

        {vendor.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {vendor.specialties.slice(0, 3).map((specialty) => (
              <Badge
                key={specialty}
                variant="outline"
                className="text-xs px-2 py-0.5"
              >
                {specialty}
              </Badge>
            ))}
            {vendor.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{vendor.specialties.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-brand-500 to-market-500 hover:from-brand-600 hover:to-market-600"
          >
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
