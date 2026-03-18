import React, { useState, useMemo } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { Search, X, SlidersHorizontal, CalendarDays, Route as RouteIcon, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MAPBOX_TOKEN, VALENCIA_CENTER, MAP_STYLE } from "@/lib/mapbox";
import { fallas } from "@/data/fallas";
import type { Falla } from "@/types";

const MapPage: React.FC = () => {
  const [viewState, setViewState] = useState(VALENCIA_CENTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFalla, setSelectedFalla] = useState<Falla | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return [];
    const q = searchQuery.toLowerCase();
    return fallas
      .filter(f => f.name.toLowerCase().includes(q))
      .slice(0, 3);
  }, [searchQuery]);

  return (
    <div className="relative h-screen w-full">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {fallas.map(falla => (
          <Marker
            key={falla.id}
            latitude={falla.lat}
            longitude={falla.lng}
            anchor="center"
            onClick={e => { 
              e.originalEvent.stopPropagation(); 
              setSelectedFalla(falla); 
            }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent shadow-lg border-2 border-background cursor-pointer hover:scale-110 transition-transform">
              <Star className="w-4 h-4 text-accent-foreground fill-current" />
            </div>
          </Marker>
        ))}
      </Map>

      {/* Search bar */}
      <div className="absolute top-4 left-4 right-16 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar fallas o eventos..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-9 pr-9 bg-card/95 backdrop-blur-sm shadow-lg border-border/50 h-11 rounded-xl text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 overflow-hidden">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  className="w-full text-left px-3 py-2.5 hover:bg-accent/50 transition-colors flex items-center gap-2 border-b last:border-b-0 border-border/30"
                  onMouseDown={e => {
                    e.preventDefault();
                    setSearchQuery(s.name);
                    setShowSuggestions(false);
                    setSelectedFalla(s);
                  }}
                >
                  <Star className="w-3.5 h-3.5 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{s.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="w-11 h-11 rounded-xl shadow-lg bg-card/95 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="w-11 h-11 rounded-xl shadow-lg bg-card/95 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <CalendarDays className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="w-11 h-11 rounded-xl shadow-lg bg-card/95 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <RouteIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MapPage;