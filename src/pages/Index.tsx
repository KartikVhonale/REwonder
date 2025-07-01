import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import VendorCard, { type Vendor } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Users,
  Clock,
  TrendingUp,
  Star,
  Navigation,
  Smartphone,
  Heart,
} from "lucide-react";

// Mock data for featured vendors
const featuredVendors: Vendor[] = [
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
];

const categories = [
  { name: "Food", icon: "🍕", count: "120+" },
  { name: "Drinks", icon: "☕", count: "45+" },
  { name: "Retail", icon: "🛍️", count: "89+" },
  { name: "Services", icon: "⚡", count: "67+" },
];

const stats = [
  { icon: Users, label: "Active Vendors", value: "320+" },
  { icon: MapPin, label: "Locations Covered", value: "15" },
  { icon: Star, label: "Average Rating", value: "4.7" },
  { icon: Clock, label: "Hours Saved", value: "1000+" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState(featuredVendors);

  const handleToggleFavorite = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, isFavorite: !vendor.isFavorite }
          : vendor,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-vendor-50" />
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97316" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-40'
          }
        />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-brand-200 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Over x vendors and growing
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-brand-600 to-market-600 bg-clip-text text-transparent animate-fade-in">
              Discover Amazing
              <br />
              Street Vendors
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Find the best local street vendors near you. Real-time locations,
              authentic reviews, and everything you need to discover hidden gems
              in your city.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search for tacos, coffee, jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 h-14 text-lg border-2 border-slate-200 focus:border-brand-400 rounded-xl"
                />
                <Button
                  size="lg"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-market-500 hover:from-brand-600 hover:to-market-600 rounded-lg"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
              <Link to="/discover">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand-500 to-market-500 hover:from-brand-600 hover:to-market-600 text-white px-8"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Explore Nearby
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2">
                <Smartphone className="w-5 h-5 mr-2" />
                Download App
              </Button>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fade-in">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <div className="font-medium text-slate-800">
                    {category.name}
                  </div>
                  <div className="text-sm text-slate-500">{category.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-brand-500 to-market-500 rounded-xl mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Featured Vendors
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Popular Near You
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the most loved vendors in your area, handpicked by our
              community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onToggleFavorite={handleToggleFavorite}
                className="animate-fade-in"
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/discover">
              <Button size="lg" variant="outline" className="border-2">
                View All Vendors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-brand-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How StreetFind Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Finding amazing street vendors has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-500 to-market-500 rounded-2xl mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Search & Discover</h3>
              <p className="text-slate-600">
                Search by location, food type, or vendor name to find exactly
                what you're craving
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-500 to-market-500 rounded-2xl mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Real-time Locations
              </h3>
              <p className="text-slate-600">
                Get live updates on vendor locations, hours, and availability to
                plan your visit
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-500 to-market-500 rounded-2xl mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Save Favorites</h3>
              <p className="text-slate-600">
                Create your personal list of favorite vendors and get notified
                when they're nearby
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-to-r from-brand-500 to-market-500 rounded-3xl p-8 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Exploring?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of food lovers and discover the best street vendors
              in your city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/discover">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-brand-600 hover:bg-slate-50"
                >
                  Start Exploring
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-market-500">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">StreetFind</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 StreetFind. Connecting communities, one vendor at a time.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
