"use client"

import { useEffect, useState } from "react"
import type { WeatherData } from "@/lib/weather"
import { CATEGORY_STYLES } from "@/lib/weather"

export function AirportWeather({ icao }: { icao: string }) {
  const [wx, setWx] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/weather?ids=${icao}`)
      .then((r) => r.json())
      .then((data: WeatherData[]) => {
        setWx(data[0] ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [icao])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading weather…</p>
  }

  if (!wx?.category) {
    return <p className="text-sm text-muted-foreground">No METAR available for this airport.</p>
  }

  const style = CATEGORY_STYLES[wx.category]
  const parts: string[] = []
  if (wx.windDir !== null && wx.windSpeed !== null) parts.push(`Wind ${wx.windDir}° at ${wx.windSpeed} kts`)
  if (wx.visibility !== null) parts.push(`Vis ${wx.visibility} sm`)
  if (wx.tempC !== null) parts.push(`${wx.tempC}°C`)

  return (
    <div className="space-y-2">
      <span className={`inline-block text-sm font-bold px-2.5 py-1 rounded ${style.badge}`}>
        {wx.category}
      </span>
      {parts.length > 0 && (
        <p className="text-sm text-muted-foreground">{parts.join(" · ")}</p>
      )}
    </div>
  )
}
