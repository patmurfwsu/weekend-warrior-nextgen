"use client"

import { useEffect, useRef, useState } from "react"
import type { Airport } from "@/lib/airport-data"
import type { WeatherData } from "@/lib/weather"
import { CATEGORY_STYLES, isWeatherStale } from "@/lib/weather"
import { Star, X, Plus, Minus, LocateFixed } from "lucide-react"
import { NavigateDropdown } from "@/components/navigate-dropdown"

interface MapComponentProps {
  airports: Airport[]
  filteredIcaos: Set<string>
  apiKey: string
  weatherMap: Record<string, WeatherData>
  favorites: Set<string>
  onToggleFavorite: (icao: string) => void
}

interface PlaceData {
  photoUrl: string | null
  rating: number | null
  totalRatings: number | null
  website: string | null
  reviews: Array<{
    authorName: string
    rating: number
    text: string
    relativeTime: string
    authorUri: string | null
  }>
}

declare global {
  interface Window {
    google: any
    initWeekendWarriorMap?: () => void
  }
}

function makeMarkerContent(icao: string, fillColor: string) {
  const wrapper = document.createElement("div")
  wrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="54" aria-hidden="true">
    <circle cx="22" cy="18" r="15" fill="${fillColor}" stroke="white" stroke-width="2.5"/>
    <text x="22" y="24" text-anchor="middle" font-size="15" fill="white" font-family="sans-serif">✈</text>
    <text x="22" y="42" text-anchor="middle" font-size="9" font-weight="bold"
      font-family="monospace,sans-serif" fill="white"
      stroke="#111" stroke-width="2.5" paint-order="stroke">${icao}</text>
  </svg>`
  return wrapper.firstElementChild as SVGElement
}

// Popup content — defined at module scope to avoid React remount on each render
function PopupContent({
  airport,
  placeData,
  loading,
  weatherMap,
  favorites,
  onToggleFavorite,
}: {
  airport: Airport
  placeData: PlaceData | null
  loading: boolean
  weatherMap: Record<string, WeatherData>
  favorites: Set<string>
  onToggleFavorite: (icao: string) => void
}) {
  const wx = weatherMap[airport.icao]
  const wxStyle = wx?.category && !isWeatherStale(wx) ? CATEGORY_STYLES[wx.category] : null

  return (
    <>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h4 className="font-bold text-sm text-gray-900">{airport.restaurant.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{airport.icao} · {airport.name}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(airport.icao) }}
          title={favorites.has(airport.icao) ? "Remove from favorites" : "Save to favorites"}
          className="shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Star
            className={`w-4 h-4 ${
              favorites.has(airport.icao)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400 hover:text-yellow-400"
            }`}
          />
        </button>
      </div>

      {/* Weather badge */}
      {wx && wxStyle && (
        <div className={`flex items-center gap-2 mb-2 px-2 py-1.5 rounded-md text-xs ${wxStyle.badge}`}>
          <span className="font-bold">{wx.category}</span>
          {wx.windDir != null && wx.windSpeed != null && (
            <span>{wx.windDir}° at {wx.windSpeed} kt</span>
          )}
          {wx.visibility != null && (
            <span>{wx.visibility >= 10 ? "10+" : wx.visibility} SM</span>
          )}
        </div>
      )}
      {wx && isWeatherStale(wx) && (
        <div className="mb-2 rounded-md bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-900">Stale METAR</div>
      )}

      {/* Place details */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {placeData?.photoUrl && (
            // Google Place photo URLs are dynamic and cannot use a stable Next.js image loader.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={placeData.photoUrl}
              alt={airport.restaurant.name}
              className="w-full h-36 object-cover rounded-md mb-2"
            />
          )}

          {placeData?.rating && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-semibold">{placeData.rating}</span>
              <span className="text-yellow-400 text-sm">
                {"★".repeat(Math.round(placeData.rating))}
                {"☆".repeat(5 - Math.round(placeData.rating))}
              </span>
              {placeData.totalRatings && (
                <span className="text-xs text-gray-500">({placeData.totalRatings})</span>
              )}
            </div>
          )}

          {placeData?.reviews && placeData.reviews.length > 0 && (
            <div className="space-y-2 mb-2">
              {placeData.reviews.map((review, idx) => (
                <div key={idx} className="border-t border-gray-100 pt-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    {review.authorUri ? (
                      <a href={review.authorUri} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-700 hover:underline">
                        {review.authorName}
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-gray-700">{review.authorName}</span>
                    )}
                    <span className="text-xs text-yellow-500">{"★".repeat(review.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-tight">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {(!placeData || (!placeData.photoUrl && !placeData.rating)) && (
            <p className="text-xs text-gray-500 italic mb-2">{airport.restaurant.description}</p>
          )}

          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-3">
            <NavigateDropdown icao={airport.icao} variant="popup" />
            {(placeData?.website ?? airport.restaurant.website) && (
              <a
                href={placeData?.website ?? airport.restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Website →
              </a>
            )}
          </div>
        </>
      )}
    </>
  )
}

export function MapComponent({ airports, filteredIcaos, apiKey, weatherMap, favorites, onToggleFavorite }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersMapRef = useRef<Map<string, any>>(new Map())

  // position: {x,y} = desktop floating popup; position: null = mobile bottom sheet
  const [hoverData, setHoverData] = useState<{
    airport: Airport
    placeData: PlaceData | null
    loading: boolean
    position: { x: number; y: number } | null
  } | null>(null)

  const [locating, setLocating] = useState(false)
  const placeCache = useRef<Map<string, PlaceData>>(new Map())
  const isOverPopupRef = useRef(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Stable refs so closures inside initializeMap always read latest values
  const weatherMapRef = useRef<Record<string, WeatherData>>({})
  const fetchPlaceDetailsRef = useRef<(placeId: string, airportIcao: string) => void>(() => {})

  useEffect(() => { weatherMapRef.current = weatherMap }, [weatherMap])

  useEffect(() => {
    fetchPlaceDetailsRef.current = async (placeId: string, airportIcao: string) => {
      const cached = placeCache.current.get(placeId)
      if (cached) {
        setHoverData((prev) =>
          prev?.airport.icao === airportIcao ? { ...prev, placeData: cached, loading: false } : prev,
        )
        return
      }

      try {
        const { Place } = await window.google.maps.importLibrary("places")
        const place = new Place({ id: placeId })
        await place.fetchFields({ fields: ["photos", "rating", "userRatingCount", "reviews", "websiteURI"] })
        const placeData: PlaceData = {
          photoUrl: place.photos?.[0]?.getURI({ maxWidth: 400, maxHeight: 250 }) ?? null,
          rating: place.rating ?? null,
          totalRatings: place.userRatingCount ?? null,
          website: place.websiteURI ?? null,
          reviews: (place.reviews ?? []).slice(0, 2).map((review: any) => {
            const text = review.text ?? ""
            return {
              authorName: review.authorAttribution?.displayName ?? "Google user",
              authorUri: review.authorAttribution?.uri ?? null,
              rating: review.rating ?? 0,
              text: text.length > 120 ? text.slice(0, 120) + "…" : text,
              relativeTime: review.relativePublishTimeDescription ?? "",
            }
          }),
        }
        placeCache.current.set(placeId, placeData)
        setHoverData((prev) => prev?.airport.icao === airportIcao ? { ...prev, placeData, loading: false } : prev)
      } catch {
        setHoverData((prev) => prev?.airport.icao === airportIcao
          ? { ...prev, placeData: { photoUrl: null, rating: null, totalRatings: null, website: null, reviews: [] }, loading: false }
          : prev)
      }
    }
  })

  // Show/hide markers when filter changes
  useEffect(() => {
    markersMapRef.current.forEach((marker, icao) => {
      marker.map = filteredIcaos.has(icao) ? mapInstanceRef.current : null
    })
  }, [filteredIcaos])

  // Re-color markers when weather data arrives or updates
  useEffect(() => {
    if (!window.google?.maps) return
    markersMapRef.current.forEach((marker, icao) => {
      const wx = weatherMap[icao]
      const color = wx?.category && !isWeatherStale(wx) ? CATEGORY_STYLES[wx.category].markerHex : "#6b7280"
      marker.replaceChildren(makeMarkerContent(icao, color))
    })
  }, [weatherMap])

  // Load Google Maps script once
  useEffect(() => {
    if (!apiKey) return
    if (typeof window.google?.maps?.importLibrary === "function") {
      void initializeMap()
      return
    }
    window.initWeekendWarriorMap = () => { void initializeMap() }
    if (document.getElementById("weekend-warrior-google-maps")) return
    const script = document.createElement("script")
    script.id = "weekend-warrior-google-maps"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&v=weekly&loading=async&callback=initWeekendWarriorMap`
    script.async = true
    document.body.appendChild(script)
  }, [apiKey]) // eslint-disable-line react-hooks/exhaustive-deps

  async function initializeMap() {
    if (!mapRef.current || !window.google) return

    const centerLat = airports.reduce((sum, a) => sum + a.lat, 0) / airports.length
    const centerLng = airports.reduce((sum, a) => sum + a.lng, 0) / airports.length

    const [{ Map: GoogleMap }, { AdvancedMarkerElement }] = await Promise.all([
      window.google.maps.importLibrary("maps"),
      window.google.maps.importLibrary("marker"),
    ])
    const map = new GoogleMap(mapRef.current, {
      zoom: 4,
      center: { lat: centerLat, lng: centerLng },
      mapTypeId: "satellite",
      disableDefaultUI: true,   // kills ALL native controls; we supply our own
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID",
    })
    mapInstanceRef.current = map

    airports.forEach((airport) => {
      const wx = weatherMapRef.current[airport.icao]
      const color = wx?.category && !isWeatherStale(wx) ? CATEGORY_STYLES[wx.category].markerHex : "#6b7280"

      const marker = new AdvancedMarkerElement({
        position: { lat: airport.lat, lng: airport.lng },
        title: airport.name,
        map: filteredIcaos.has(airport.icao) ? map : null,
        content: makeMarkerContent(airport.icao, color),
        gmpClickable: true,
      })
      markersMapRef.current.set(airport.icao, marker)

      const showPopup = (positionOverride?: { x: number; y: number } | null) => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }

        // positionOverride = null  → bottom sheet
        // positionOverride = {x,y} → floating popup at those coords
        // positionOverride = undefined → compute from marker position
        let position: { x: number; y: number } | null

        if (positionOverride === null) {
          position = null
        } else if (positionOverride) {
          position = positionOverride
        } else {
          // Compute edge-clamped position from marker screen coords
          const projection = map.getProjection()
          const bounds = map.getBounds()
          if (!projection || !bounds) return

          const topRight = projection.fromLatLngToPoint(bounds.getNorthEast())
          const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest())
          const scale = Math.pow(2, map.getZoom())
          const pt = projection.fromLatLngToPoint(new window.google.maps.LatLng(airport.lat, airport.lng))

          const x = (pt.x - bottomLeft.x) * scale
          const y = (pt.y - topRight.y) * scale

          const POPUP_W = 300
          const POPUP_H = 520  // generous max including photo + reviews + badges
          const cW = mapRef.current?.offsetWidth ?? 800
          const cH = mapRef.current?.offsetHeight ?? 600

          let fx = x + 20
          let fy = y - POPUP_H / 2
          if (fx + POPUP_W > cW) fx = x - POPUP_W - 20
          if (fx < 8) fx = 8
          if (fy + POPUP_H > cH - 8) fy = cH - POPUP_H - 8
          if (fy < 8) fy = 8

          position = { x: fx, y: fy }
        }

        setHoverData({ airport, placeData: null, loading: true, position })

        if (airport.restaurant.placeId) {
          fetchPlaceDetailsRef.current(airport.restaurant.placeId, airport.icao)
        } else {
          setHoverData((prev) => (prev ? { ...prev, loading: false } : null))
        }
      }

      // Desktop: hover shows floating popup
      marker.addEventListener("mouseenter", () => showPopup())

      marker.addEventListener("mouseleave", () => {
        hideTimeoutRef.current = setTimeout(() => {
          if (!isOverPopupRef.current) setHoverData(null)
        }, 120)
      })

      // Mobile tap: shows bottom sheet (position = null)
      // Also fires on desktop click — we check pointer type at call time
      marker.addEventListener("gmp-click", () => {
        // Only activate click-to-sheet on touch devices.
        // On desktop, hover already handles it; eat the click silently.
        const isTouch = window.matchMedia("(pointer: coarse)").matches
        if (!isTouch) return
        showPopup(null)
      })
    })
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-muted gap-4 text-center px-4">
        <div className="text-5xl">🗺️</div>
        <div>
          <p className="font-semibold text-foreground">Google Maps API key not configured</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Add <code className="bg-background border border-border rounded px-1.5 py-0.5 text-xs font-mono">GOOGLE_MAPS_API_KEY</code> to your{" "}
            <code className="bg-background border border-border rounded px-1.5 py-0.5 text-xs font-mono">.env.local</code> file and restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  const isBottomSheet = hoverData?.position === null

  const handleGoToLocation = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        mapInstanceRef.current.setZoom(10)
        setLocating(false)
      },
      () => setLocating(false),
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full min-h-[calc(100vh-200px)]" />

      {/* Custom map controls — zoom + locate */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => {
            const m = mapInstanceRef.current
            if (m) m.setZoom((m.getZoom() ?? 4) + 1)
          }}
          aria-label="Zoom in"
          className="w-9 h-9 bg-white rounded shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const m = mapInstanceRef.current
            if (m) m.setZoom((m.getZoom() ?? 4) - 1)
          }}
          aria-label="Zoom out"
          className="w-9 h-9 bg-white rounded shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleGoToLocation}
          disabled={locating}
          aria-label="Go to my location"
          className="w-9 h-9 bg-white rounded shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LocateFixed className={`w-4 h-4 text-blue-600 ${locating ? "animate-pulse" : ""}`} />
        </button>
      </div>

      {/* Desktop: floating hover popup */}
      {hoverData && !isBottomSheet && (
        <div
          className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3 overflow-y-auto"
          style={{
            left: hoverData.position!.x,
            top: hoverData.position!.y,
            maxWidth: 280,
            maxHeight: `calc(100% - ${hoverData.position!.y + 8}px)`,
          }}
          onMouseEnter={() => {
            isOverPopupRef.current = true
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
              hideTimeoutRef.current = null
            }
          }}
          onMouseLeave={() => {
            isOverPopupRef.current = false
            setHoverData(null)
          }}
        >
          <PopupContent
            airport={hoverData.airport}
            placeData={hoverData.placeData}
            loading={hoverData.loading}
            weatherMap={weatherMap}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      )}

      {/* Mobile: bottom sheet */}
      {hoverData && isBottomSheet && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setHoverData(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Drag handle + close */}
            <div className="relative flex items-center justify-center pt-4 pb-2 px-4">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
              <button
                onClick={() => setHoverData(null)}
                className="absolute right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 pb-8">
              <PopupContent
                airport={hoverData.airport}
                placeData={hoverData.placeData}
                loading={hoverData.loading}
                weatherMap={weatherMap}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
