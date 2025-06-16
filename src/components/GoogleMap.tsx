import { env } from "process";
import { useEffect, useRef, useState, useCallback } from "react";

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

interface GoogleMapProps {
  vendors: MapVendor[];
  selectedVendor: MapVendor | null;
  onVendorSelect: (vendor: MapVendor | null) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Default center (New York City)
const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 };
const API_KEY = import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

declare global {
  interface Window {
    initGoogleMap?: () => void;
    google?: any;
  }
}

const GoogleMap = ({
  vendors,
  selectedVendor,
  onVendorSelect,
  center = DEFAULT_CENTER,
  zoom = 13,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Initialize map when both API is loaded and DOM is ready
  const initializeMap = useCallback(() => {
    console.log("Attempting to initialize map...");
    console.log("Map ref exists:", !!mapRef.current);
    console.log("Google API loaded:", !!window.google?.maps);

    if (!window.google?.maps) {
      console.log("Google Maps API not ready yet");
      return;
    }

    if (!mapRef.current) {
      console.log("Map container not ready yet, retrying...");
      // Retry after a short delay
      setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 100);
      return;
    }

    try {
      console.log("Creating map instance...");
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      console.log("✅ Map created successfully!");
      setMap(mapInstance);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("❌ Error creating map:", err);
      setError("Failed to create map instance");
      setIsLoading(false);
    }
  }, [center, zoom]);

  // Load Google Maps API
  useEffect(() => {
    // Check if API is already loaded
    if (window.google?.maps) {
      console.log("Google Maps API already available");
      setApiLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]',
    );
    if (existingScript) {
      console.log("Google Maps script already exists, waiting for load...");
      // Wait for existing script to load
      const checkApiReady = () => {
        if (window.google?.maps) {
          console.log("Google Maps API now ready");
          setApiLoaded(true);
        } else {
          setTimeout(checkApiReady, 100);
        }
      };
      checkApiReady();
      return;
    }

    console.log("Loading Google Maps API script...");

    // Create unique callback name to avoid conflicts
    const callbackName = `initGoogleMap_${Date.now()}`;

    // Create global callback
    (window as any)[callbackName] = () => {
      console.log("✅ Google Maps API loaded successfully!");
      setApiLoaded(true);
      // Clean up callback
      delete (window as any)[callbackName];
    };

    // Create and load script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${callbackName}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onerror = (error) => {
      console.error("❌ Failed to load Google Maps API:", error);
      setError(
        "Failed to load Google Maps API. Please check your internet connection and API key.",
      );
      setIsLoading(false);
      // Clean up callback
      delete (window as any)[callbackName];
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if ((window as any)[callbackName]) {
        delete (window as any)[callbackName];
      }
    };
  }, []);

  // Initialize map when API is loaded
  useEffect(() => {
    if (apiLoaded) {
      console.log("API loaded, initializing map...");
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [apiLoaded, initializeMap]);

  // Create vendor markers
  useEffect(() => {
    if (!map || !vendors.length || !window.google?.maps) {
      return;
    }

    console.log("Creating markers for", vendors.length, "vendors");

    // Clear existing markers
    markers.forEach((marker) => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });

    const newMarkers = vendors
      .map((vendor) => {
        try {
          const marker = new window.google.maps.Marker({
            position: vendor.coordinates,
            map,
            title: vendor.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor:
                vendor.category === "food"
                  ? "#ef4444"
                  : vendor.category === "drinks"
                    ? "#f59e0b"
                    : vendor.category === "retail"
                      ? "#8b5cf6"
                      : "#3b82f6",
              fillOpacity: vendor.isOpen ? 1 : 0.6,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            },
          });

          marker.addListener("click", () => {
            console.log("Marker clicked:", vendor.name);
            onVendorSelect(vendor);
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 1500);
          });

          return marker;
        } catch (err) {
          console.error("Error creating marker for", vendor.name, err);
          return null;
        }
      })
      .filter(Boolean);

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      try {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach((marker) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        map.fitBounds(bounds);

        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(
          map,
          "idle",
          () => {
            if (map.getZoom() > 15) {
              map.setZoom(15);
            }
            window.google.maps.event.removeListener(listener);
          },
        );

        console.log("✅ All markers created and bounds set");
      } catch (err) {
        console.error("Error setting bounds:", err);
      }
    }
  }, [map, vendors, onVendorSelect]);

  // Center on selected vendor
  useEffect(() => {
    if (map && selectedVendor) {
      console.log("Centering on vendor:", selectedVendor.name);
      map.setCenter(selectedVendor.coordinates);
      map.setZoom(16);
    }
  }, [map, selectedVendor]);

  const getUserLocation = useCallback(() => {
    if (!map || !navigator.geolocation || !window.google?.maps) return;

    console.log("Getting user location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("User location:", userLocation);
        map.setCenter(userLocation);
        map.setZoom(15);

        new window.google.maps.Marker({
          position: userLocation,
          map,
          title: "Your location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
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
  }, [map]);

  if (error) {
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
            Map Loading Error
          </h3>
          <p className="text-slate-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setApiLoaded(false);
              window.location.reload();
            }}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-brand-500"
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
              </svg>
            </div>
          </div>
          <p className="text-slate-600 mb-2 font-medium">
            Loading Google Maps...
          </p>
          <p className="text-sm text-slate-500">
            {!apiLoaded ? "Loading API..." : "Initializing map..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />

      {/* Location Button */}
      <div className="absolute bottom-4 right-4">
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

export default GoogleMap;
