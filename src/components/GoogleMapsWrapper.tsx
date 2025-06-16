import React, { useEffect, useRef, useState, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { env } from "process";

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

interface GoogleMapsProps {
  vendors: MapVendor[];
  selectedVendor: MapVendor | null;
  onVendorSelect: (vendor: MapVendor | null) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const API_KEY = import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Map component that will be rendered inside the wrapper
const MapComponent: React.FC<GoogleMapsProps> = ({
  vendors,
  selectedVendor,
  onVendorSelect,
  center = { lat: 40.7589, lng: -73.9851 },
  zoom = 13,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
    });

    setMap(mapInstance);
  }, [center, zoom]);

  // Create vendor markers
  useEffect(() => {
    if (!map || !vendors.length) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = vendors.map((vendor) => {
      // Create custom marker icon based on category
      const getMarkerIcon = (category: string, isOpen: boolean) => {
        const colors = {
          food: "#ef4444", // red
          drinks: "#f59e0b", // amber
          retail: "#8b5cf6", // purple
          services: "#3b82f6", // blue
        };

        const color = colors[category as keyof typeof colors] || "#6b7280";
        const opacity = isOpen ? 1 : 0.6;

        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: color,
          fillOpacity: opacity,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        };
      };

      const marker = new google.maps.Marker({
        position: vendor.coordinates,
        map,
        title: vendor.name,
        icon: getMarkerIcon(vendor.category, vendor.isOpen),
        animation: google.maps.Animation.DROP,
      });

      // Add click listener
      marker.addListener("click", () => {
        onVendorSelect(vendor);
        // Add bounce animation for selected marker
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1500);
      });

      // Add hover effects
      marker.addListener("mouseover", () => {
        marker.setIcon({
          ...getMarkerIcon(vendor.category, vendor.isOpen),
          scale: 15,
        });
      });

      marker.addListener("mouseout", () => {
        marker.setIcon(getMarkerIcon(vendor.category, vendor.isOpen));
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);

      // Set minimum zoom level
      const listener = google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, vendors, onVendorSelect]);

  // Center map on selected vendor
  useEffect(() => {
    if (map && selectedVendor) {
      map.setCenter(selectedVendor.coordinates);
      map.setZoom(16);
    }
  }, [map, selectedVendor]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(userLocation);
          map.setZoom(15);

          // Add user location marker
          new google.maps.Marker({
            position: userLocation,
            map,
            title: "Your location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#22c55e",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
      );
    }
  }, [map]);

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />
      {/* Custom Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={getUserLocation}
          className="bg-white hover:bg-slate-50 border border-slate-300 rounded-lg p-3 shadow-lg transition-colors"
          title="Get current location"
        >
          <svg
            className="w-5 h-5 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

// Render function for different loading states
const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Loading Google Maps...</p>
            <p className="text-sm text-slate-500">Please wait</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-100">
          <div className="text-center p-8 max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Failed to Load Google Maps
            </h3>
            <p className="text-slate-600 mb-4">
              There was an error loading Google Maps. Please check your internet
              connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

// Main wrapper component
const GoogleMapsWrapper: React.FC<GoogleMapsProps> = (props) => {
  return (
    <Wrapper apiKey={API_KEY} render={render} libraries={["places"]}>
      <MapComponent {...props} />
    </Wrapper>
  );
};

export default GoogleMapsWrapper;
