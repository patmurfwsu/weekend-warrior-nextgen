"use client"

import { useState, useMemo, useEffect } from "react"
import { Map, List, Search, Star } from "lucide-react"
import type { Airport } from "@/lib/airport-data"
import type { WeatherData } from "@/lib/weather"
import { MapComponent } from "@/components/map-component"
import { AirportList } from "@/components/airport-list"
import { useFavorites } from "@/hooks/use-favorites"

interface AirportExplorerProps {
  airports: Airport[]
  apiKey: string
}

type ViewMode = "map" | "list"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
]

export function AirportExplorer({ airports, apiKey }: AirportExplorerProps) {
  const [view, setView] = useState<ViewMode>("map")
  const [query, setQuery] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({})

  const { favorites, toggle: toggleFavorite } = useFavorites()

  useEffect(() => {
    const ids = airports.map((a) => a.icao).join(",")
    fetch(`/api/weather?ids=${ids}`)
      .then((r) => r.json())
      .then((data: WeatherData[]) => {
        const map: Record<string, WeatherData> = {}
        data.forEach((w) => { map[w.icao] = w })
        setWeatherMap(map)
      })
      .catch(() => {})
  }, [airports])

  const filteredAirports = useMemo(() => {
    const q = query.toLowerCase().trim()
    return airports.filter((a) => {
      const matchesQuery =
        !q ||
        a.icao.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.restaurant.name.toLowerCase().includes(q)
      const matchesState = !stateFilter || a.state === stateFilter
      const matchesFavorites = !showFavoritesOnly || favorites.has(a.icao)
      return matchesQuery && matchesState && matchesFavorites
    })
  }, [airports, query, stateFilter, showFavoritesOnly, favorites])

  const filteredIcaos = useMemo(
    () => new Set(filteredAirports.map((a) => a.icao)),
    [filteredAirports],
  )

  const presentStates = useMemo(
    () => new Set(airports.map((a) => a.state)),
    [airports],
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Controls bar */}
      <div className="border-b border-border bg-card px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search airports or restaurants…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* State filter */}
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="py-1.5 pl-3 pr-8 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All states</option>
          {US_STATES.filter((s) => presentStates.has(s)).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Favorites filter */}
        <button
          onClick={() => setShowFavoritesOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
            showFavoritesOnly
              ? "bg-yellow-50 border-yellow-300 text-yellow-700"
              : "border-input text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-yellow-400 text-yellow-400" : ""}`} />
          Favorites
          {favorites.size > 0 && (
            <span className="ml-0.5 text-xs font-bold">{favorites.size}</span>
          )}
        </button>

        {/* Count */}
        <span className="text-xs text-muted-foreground hidden sm:block">
          {filteredAirports.length} of {airports.length} airports
        </span>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 bg-muted rounded-md p-1">
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              view === "map"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Map
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              view === "list"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 min-h-0 relative ${view === "list" ? "overflow-auto" : "overflow-hidden"}`}>
        {view === "map" ? (
          <MapComponent
            airports={airports}
            filteredIcaos={filteredIcaos}
            apiKey={apiKey}
            weatherMap={weatherMap}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <AirportList
            airports={filteredAirports}
            weatherMap={weatherMap}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  )
}
