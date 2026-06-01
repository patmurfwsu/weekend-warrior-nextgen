"use client"

import { useEffect, useRef, useState } from "react"
import type { Airport } from "@/lib/airport-data"
import type { WeatherData } from "@/lib/weather"
import { CATEGORY_STYLES } from "@/lib/weather"
import { Star, X } from "lucide-react"
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
  }>
}

declare global {
  interface Window {
    google: any
  }
}

function makeMarkerIcon(icao: string, fillColor: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="54">
    <circle cx="22" cy="18" r="15" fill="${fillColor}" stroke="white" stroke-width="2.5"/>
    <text x="22" y="24" text-anchor="middle" font-size="15" fill="white" font-family="sans-serif">✈</text>
    <text x="22" y="42" text-anchor="middle" font-size="9" font-weight="bold"
      font-family="monospace,sans-serif" fill="white"
      stroke="#111" stroke-width="2.5" paint-order="stroke">${icao}</text>
  </svg>`
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
  }
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
  const wxStyle = wx?.category ? CATEGORY_STYLES[wx.category] : null

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
          className="shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors"
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

      {/* Place details */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {placeData?.photoUrl && (
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
                    <span className="text-xs font-medium text-gray-700">{review.authorName}</span>
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
  const placesServiceRef = useRef<any>(null)

  // position: {x,y} = desktop floating popup; position: null = mobile bottom sheet
  const [hoverData, setHoverData] = useState<{
    airport: Airport
    placeData: PlaceData | null
    loading: boolean
    position: { x: number; y: number } | null
  } | null>(null)

  const placeCache = useRef<Map<string, PlaceData>>(new Map())
  const isOverPopupRef = useRef(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Stable refs so closures inside initializeMap always read latest values
  const weatherMapRef = useRef<Record<string, WeatherData>>({})
  const fetchPlaceDetailsRef = useRef<(placeId: string, airportIcao: string) => void>(() => {})

  useEffect(() => { weatherMapRef.current = weatherMap }, [weatherMap])

  useEffect(() => {
    fetchPlaceDetailsRef.current = (placeId: string, airportIcao: string) => {
      if (!placesServiceRef.current) {
        setHoverData((prev) => (prev ? { ...prev, loading: false } : null))
        return
      }

      const cached = placeCache.current.get(placeId)
      if (cached) {
        setHoverData((prev) =>
          prev?.airport.icao === airportIcao ? { ...prev, placeData: cached, loading: false } : prev,
        )
        return
      }

      placesServiceRef.current.getDetails(
        { placeId, fields: ["photos", "rating", "user_ratings_total", "reviews", "website"] },
        (place: any, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const placeData: PlaceData = {
              photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 250 }) ?? null,
              rating: place.rating ?? null,
              totalRatings: place.user_ratings_total ?? null,
              website: place.website ?? null,
              reviews: (place.reviews ?? []).slice(0, 2).map((r: any) => ({
                authorName: r.author_name,
                rating: r.rating,
                text: r.text.length > 120 ? r.text.slice(0, 120) + "…" : r.text,
                relativeTime: r.relative_time_description,
              })),
            }
            placeCache.current.set(placeId, placeData)
            setHoverData((prev) =>
              prev?.airport.icao === airportIcao ? { ...prev, placeData, loading: false } : prev,
            )
          } else {
            setHoverData((prev) =>
              prev?.airport.icao === airportIcao
                ? { ...prev, placeData: { photoUrl: null, rating: null, totalRatings: null, website: null, reviews: [] }, loading: false }
                : prev,
            )
          }
        },
      )
    }
  })

  // Show/hide markers when filter changes
  useEffect(() => {
    markersMapRef.current.forEach((marker, icao) => {
      marker.setVisible(filteredIcaos.has(icao))
    })
  }, [filteredIcaos])

  // Re-color markers when weather data arrives or updates
  useEffect(() => {
    if (!window.google?.maps) return
    markersMapRef.current.forEach((marker, icao) => {
      const wx = weatherMap[icao]
      const color = wx?.category ? CATEGORY_STYLES[wx.category].markerHex : "#6b7280"
      marker.setIcon({
        ...makeMarkerIcon(icao, color),
        scaledSize: new window.google.maps.Size(44, 54),
        anchor: new window.google.maps.Point(22, 18),
      })
    })
  }, [weatherMap])

  // Load Google Maps script once
  useEffect(() => {
    if (!apiKey) return
    if (window.google?.maps) {
      initializeMap()
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = initializeMap
    document.body.appendChild(script)
  }, [apiKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const centerLat = airports.reduce((sum, a) => sum + a.lat, 0) / airports.length
    const centerLng = airports.reduce((sum, a) => sum + a.lng, 0) / airports.length

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: centerLat, lng: centerLng },
      mapTypeId: "satellite",
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: false,
    })
    mapInstanceRef.current = map
    placesServiceRef.current = new window.google.maps.places.PlacesService(map)

    airports.forEach((airport) => {
      const wx = weatherMapRef.current[airport.icao]
      const color = wx?.category ? CATEGORY_STYLES[wx.category].markerHex : "#6b7280"

      const marker = new window.google.maps.Marker({
        position: { lat: airport.lat, lng: airport.lng },
        map,
        title: airport.name,
        visible: filteredIcaos.has(airport.icao),
        icon: {
          ...makeMarkerIcon(airport.icao, color),
          scaledSize: new window.google.maps.Size(44, 54),
          anchor: new window.google.maps.Point(22, 18),
        },
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
          const pt = projection.fromLatLngToPoint(marker.getPosition())

          const x = (pt.x - bottomLeft.x) * scale
          const y = (pt.y - topRight.y) * scale

          const POPUP_W = 300
          const POPUP_H = 380
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
      marker.addListener("mouseover", () => showPopup())

      marker.addListener("mouseout", () => {
        hideTimeoutRef.current = setTimeout(() => {
          if (!isOverPopupRef.current) setHoverData(null)
        }, 120)
      })

      // Mobile tap: shows bottom sheet (position = null)
      // Also fires on desktop click — we check pointer type at call time
      marker.addListener("click", () => {
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full min-h-[calc(100vh-200px)]" />

      {/* Desktop: floating hover popup */}
      {hoverData && !isBottomSheet && (
        <div
          className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3"
          style={{ left: hoverData.position!.x, top: hoverData.position!.y, maxWidth: 280 }}
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
