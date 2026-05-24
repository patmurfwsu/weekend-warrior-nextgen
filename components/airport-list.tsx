"use client"

import type { Airport } from "@/lib/airport-data"
import type { WeatherData } from "@/lib/weather"
import { CATEGORY_STYLES } from "@/lib/weather"
import { MapPin, ExternalLink, Star } from "lucide-react"

interface AirportListProps {
  airports: Airport[]
  weatherMap: Record<string, WeatherData>
  favorites: Set<string>
  onToggleFavorite: (icao: string) => void
}

export function AirportList({ airports, weatherMap, favorites, onToggleFavorite }: AirportListProps) {
  if (airports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">No airports match your search.</p>
        <p className="text-sm text-muted-foreground mt-1">Try a different name, ICAO code, or state.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-3">
      {airports.map((airport) => {
        const wx = weatherMap[airport.icao]
        const wxStyle = wx?.category ? CATEGORY_STYLES[wx.category] : null
        const isFavorite = favorites.has(airport.icao)

        return (
          <div
            key={airport.icao}
            className="bg-card border border-border rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
          >
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded font-mono">
                {airport.icao}
              </span>
              <span className="text-xs text-muted-foreground font-medium">{airport.state}</span>
              {wxStyle && wx?.category && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${wxStyle.badge}`}>
                  {wx.category}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{airport.name}</p>
              <p className="font-semibold text-foreground truncate">{airport.restaurant.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{airport.restaurant.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleFavorite(airport.icao)}
                title={isFavorite ? "Remove from favorites" : "Save to favorites"}
                className="p-1.5 rounded hover:bg-muted transition-colors"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
                  }`}
                />
              </button>
              <a
                href={`https://maps.google.com/maps?q=${airport.lat},${airport.lng}&z=15`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
                Navigate
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
