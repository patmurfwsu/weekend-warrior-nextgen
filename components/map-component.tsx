"use client"

import { useEffect, useRef, useState } from "react"
import type { Airport } from "@/lib/airport-data"
import type { WeatherData } from "@/lib/weather"
import { CATEGORY_STYLES } from "@/lib/weather"
import { Star } from "lucide-react"

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

export function MapComponent({ airports, filteredIcaos, apiKey, weatherMap, favorites, onToggleFavorite }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersMapRef = useRef<Map<string, any>>(new Map())
  const infoWindowRef = useRef<any>(null)
  const placesServiceRef = useRef<any>(null)
  const [hoverData, setHoverData] = useState<{
    airport: Airport
    placeData: PlaceData | null
    loading: boolean
    position: { x: number; y: number; anchor?: "bottom-center" }
  } | null>(null)
  const placeCache = useRef<Map<string, PlaceData>>(new Map())
  const isOverThumbnailRef = useRef(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Stable refs so closures inside initializeMap can read latest values
  const weatherMapRef = useRef<Record<string, WeatherData>>({})
  const favoritesRef = useRef<Set<string>>(new Set())
  const fetchPlaceDetailsRef = useRef<(placeId: string, airportIcao: string) => void>(() => {})

  useEffect(() => { weatherMapRef.current = weatherMap }, [weatherMap])
  useEffect(() => { favoritesRef.current = favorites }, [favorites])

  useEffect(() => {
    fetchPlaceDetailsRef.current = (placeId: string, airportIcao: string) => {
      if (!placesServiceRef.current) {
        setHoverData((prev) => (prev ? { ...prev, loading: false } : null))
        return
      }

      const cached = placeCache.current.get(placeId)
      if (cached) {
        setHoverData((prev) =>
          prev && prev.airport.icao === airportIcao ? { ...prev, placeData: cached, loading: false } : prev,
        )
        return
      }

      const request = {
        placeId,
        fields: ["photos", "rating", "user_ratings_total", "reviews", "website"],
      }

      placesServiceRef.current.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const photoUrl =
            place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 }) : null

          const reviews = (place.reviews || []).slice(0, 2).map((review: any) => ({
            authorName: review.author_name,
            rating: review.rating,
            text: review.text.length > 100 ? review.text.substring(0, 100) + "..." : review.text,
            relativeTime: review.relative_time_description,
          }))

          const placeData: PlaceData = {
            photoUrl,
            rating: place.rating || null,
            totalRatings: place.user_ratings_total || null,
            website: place.website || null,
            reviews,
          }

          placeCache.current.set(placeId, placeData)
          setHoverData((prev) =>
            prev && prev.airport.icao === airportIcao ? { ...prev, placeData, loading: false } : prev,
          )
        } else {
          setHoverData((prev) =>
            prev && prev.airport.icao === airportIcao
              ? { ...prev, placeData: { photoUrl: null, rating: null, totalRatings: null, website: null, reviews: [] }, loading: false }
              : prev,
          )
        }
      })
    }
  })

  useEffect(() => {
    markersMapRef.current.forEach((marker, icao) => {
      marker.setVisible(filteredIcaos.has(icao))
    })
  }, [filteredIcaos])

  useEffect(() => {
    if (!apiKey) return

    if (window.google && window.google.maps) {
      initializeMap()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = initializeMap
    document.body.appendChild(script)
  }, [apiKey])

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const centerLat = airports.reduce((sum, a) => sum + a.lat, 0) / airports.length
    const centerLng = airports.reduce((sum, a) => sum + a.lng, 0) / airports.length

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: centerLat, lng: centerLng },
      mapTypeId: "satellite",
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: false,
    })

    mapInstanceRef.current = newMap

    const service = new window.google.maps.places.PlacesService(newMap)
    placesServiceRef.current = service

    const newInfoWindow = new window.google.maps.InfoWindow()
    infoWindowRef.current = newInfoWindow

    const makeIcon = (icao: string) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="54">
        <circle cx="22" cy="18" r="15" fill="#3366cc" stroke="white" stroke-width="2.5"/>
        <text x="22" y="24" text-anchor="middle" font-size="15" fill="white" font-family="sans-serif">✈</text>
        <text x="22" y="42" text-anchor="middle" font-size="9" font-weight="bold"
          font-family="monospace,sans-serif" fill="white"
          stroke="#111" stroke-width="2.5" paint-order="stroke">${icao}</text>
      </svg>`
      return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(44, 54),
        anchor: new window.google.maps.Point(22, 18),
      }
    }

    airports.forEach((airport) => {
      const marker = new window.google.maps.Marker({
        position: { lat: airport.lat, lng: airport.lng },
        map: newMap,
        title: airport.name,
        visible: filteredIcaos.has(airport.icao),
        icon: makeIcon(airport.icao),
      })

      markersMapRef.current.set(airport.icao, marker)

      marker.addListener("mouseover", () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }

        const projection = newMap.getProjection()
        const bounds = newMap.getBounds()
        if (!projection || !bounds) return

        const topRight = projection.fromLatLngToPoint(bounds.getNorthEast())
        const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest())
        const scale = Math.pow(2, newMap.getZoom())
        const markerPoint = projection.fromLatLngToPoint(marker.getPosition())

        const x = (markerPoint.x - bottomLeft.x) * scale
        const y = (markerPoint.y - topRight.y) * scale

        setHoverData({ airport, placeData: null, loading: true, position: { x, y } })

        if (airport.restaurant.placeId) {
          fetchPlaceDetailsRef.current(airport.restaurant.placeId, airport.icao)
        } else {
          setHoverData((prev) => (prev ? { ...prev, loading: false } : null))
        }
      })

      marker.addListener("mouseout", () => {
        hideTimeoutRef.current = setTimeout(() => {
          if (!isOverThumbnailRef.current) setHoverData(null)
        }, 100)
      })

      marker.addListener("click", () => {
        const wx = weatherMapRef.current[airport.icao]
        const wxStyle = wx?.category ? CATEGORY_STYLES[wx.category] : null
        const wxBadge = wxStyle && wx?.category
          ? `<span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;background:${wxStyle.hex};color:${wxStyle.textHex}">${wx.category}</span>`
          : ""

        const content = `
          <div class="p-3 max-w-xs">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">${airport.icao}</span>
              <span class="text-xs text-gray-500">${airport.state}</span>
              ${wxBadge}
            </div>
            <p class="text-sm font-semibold text-gray-700 mb-2">${airport.name}</p>
            <div class="mb-3 pb-3 border-b border-gray-200">
              <p class="text-sm font-semibold text-gray-900">${airport.restaurant.name}</p>
              <p class="text-xs text-gray-600 mt-1">${airport.restaurant.description}</p>
            </div>
            <a
              href="https://maps.google.com/maps?q=${airport.lat},${airport.lng}&z=15"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              Navigate →
            </a>
          </div>
        `
        infoWindowRef.current.setContent(content)
        infoWindowRef.current.open(newMap, marker)

        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }
        setHoverData({ airport, placeData: null, loading: true, position: { x: 0, y: 0, anchor: "bottom-center" } })
        if (airport.restaurant.placeId) {
          fetchPlaceDetailsRef.current(airport.restaurant.placeId, airport.icao)
        } else {
          setHoverData((prev) => (prev ? { ...prev, loading: false } : null))
        }
      })
    })
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>,
      )
    }
    return stars
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full min-h-[calc(100vh-200px)]" />

      {hoverData && (
        <div
          className={`absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3 ${
            hoverData.placeData?.website ? "cursor-pointer hover:shadow-2xl transition-shadow" : ""
          }`}
          style={
            hoverData.position.anchor === "bottom-center"
              ? { left: "50%", bottom: 16, transform: "translateX(-50%)", maxWidth: 280 }
              : { left: hoverData.position.x + 20, top: hoverData.position.y - 10, maxWidth: 280, transform: "translateY(-50%)" }
          }
          onMouseEnter={() => {
            isOverThumbnailRef.current = true
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
              hideTimeoutRef.current = null
            }
          }}
          onMouseLeave={() => {
            isOverThumbnailRef.current = false
            setHoverData(null)
          }}
          onClick={() => {
            if (hoverData.placeData?.website) {
              window.open(hoverData.placeData.website, "_blank", "noopener,noreferrer")
            }
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-sm text-gray-900">{hoverData.airport.restaurant.name}</h4>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(hoverData.airport.icao) }}
              title={favorites.has(hoverData.airport.icao) ? "Remove from favorites" : "Save to favorites"}
              className="shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  favorites.has(hoverData.airport.icao)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400 hover:text-yellow-400"
                }`}
              />
            </button>
          </div>

          {(() => {
            const wx = weatherMap[hoverData.airport.icao]
            const wxStyle = wx?.category ? CATEGORY_STYLES[wx.category] : null
            if (!wx || !wxStyle) return null
            return (
              <div className={`flex items-center gap-2 mb-2 px-2 py-1.5 rounded-md text-xs ${wxStyle.badge}`}>
                <span className="font-bold">{wx.category}</span>
                {wx.windDir != null && wx.windSpeed != null && (
                  <span>{wx.windDir}° at {wx.windSpeed} kt</span>
                )}
                {wx.visibility != null && (
                  <span>{wx.visibility >= 10 ? "10+" : wx.visibility} SM</span>
                )}
              </div>
            )
          })()}

          {hoverData.loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {hoverData.placeData?.photoUrl && (
                <img
                  src={hoverData.placeData.photoUrl || "/placeholder.svg"}
                  alt={hoverData.airport.restaurant.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}

              {hoverData.placeData?.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm font-semibold">{hoverData.placeData.rating}</span>
                  <div className="flex">{renderStars(hoverData.placeData.rating)}</div>
                  {hoverData.placeData.totalRatings && (
                    <span className="text-xs text-gray-500">({hoverData.placeData.totalRatings})</span>
                  )}
                </div>
              )}

              {hoverData.placeData?.reviews && hoverData.placeData.reviews.length > 0 && (
                <div className="space-y-2">
                  {hoverData.placeData.reviews.map((review, idx) => (
                    <div key={idx} className="border-t border-gray-100 pt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-medium text-gray-700">{review.authorName}</span>
                        <span className="text-xs text-yellow-500">{"★".repeat(review.rating)}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-tight">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {hoverData.placeData?.website && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-blue-600 font-medium">Click to visit website</p>
                </div>
              )}

              {!hoverData.placeData?.photoUrl && !hoverData.placeData?.rating && (
                <p className="text-xs text-gray-500 italic">No Google Places data available</p>
              )}

              <div className="mt-3 pt-2 border-t border-gray-100">
                <a
                  href={`https://maps.google.com/maps?q=${hoverData.airport.lat},${hoverData.airport.lng}&z=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
                >
                  Navigate →
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
