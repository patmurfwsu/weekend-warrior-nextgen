"use client"

import { useEffect, useState } from "react"
import type { Airport } from "@/lib/airport-data"
import { MapPin, Navigation, LocateFixed } from "lucide-react"

interface NearbyAirport extends Airport {
  distanceMiles: number
}

type Status = "loading" | "denied" | "results"

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export function NearbyAirports({ airports }: { airports: Airport[] }) {
  const [status, setStatus] = useState<Status>("loading")
  const [nearby, setNearby] = useState<NearbyAirport[]>([])

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("denied")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const results = airports
          .map((a) => ({ ...a, distanceMiles: haversine(latitude, longitude, a.lat, a.lng) }))
          .filter((a) => a.distanceMiles <= 100)
          .sort((a, b) => a.distanceMiles - b.distanceMiles)

        setNearby(results)
        setStatus("results")
      },
      () => {
        setStatus("denied")
      },
      { timeout: 8000 },
    )
  }, [airports])

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-1">Airports Near You</h2>
        <p className="text-sm text-muted-foreground mb-8">
          On-field restaurants within 100 miles of your current location
        </p>

        {status === "loading" && (
          <div className="flex items-center gap-3 text-muted-foreground py-8">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
            <span className="text-sm">Finding airports near you…</span>
          </div>
        )}

        {status === "denied" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center rounded-xl border border-dashed border-border">
            <LocateFixed className="w-8 h-8 text-muted-foreground/50" />
            <div>
              <p className="text-sm font-medium text-foreground">Location access needed</p>
              <p className="text-xs text-muted-foreground mt-1">
                Allow location access in your browser to see nearby airports
              </p>
            </div>
          </div>
        )}

        {status === "results" && nearby.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <MapPin className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-muted-foreground">No airports within 100 miles — try the full map</p>
          </div>
        )}

        {status === "results" && nearby.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearby.map((airport) => (
              <div
                key={airport.icao}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                    {airport.icao}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {Math.round(airport.distanceMiles)} mi
                  </span>
                </div>
                <p className="font-semibold text-foreground text-sm mb-0.5">{airport.restaurant.name}</p>
                <p className="text-xs text-muted-foreground mb-4">{airport.name}</p>
                <a
                  href={`https://maps.google.com/maps?q=${airport.lat},${airport.lng}&z=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Navigate
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
