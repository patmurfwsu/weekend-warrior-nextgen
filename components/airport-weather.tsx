"use client"

import { useEffect, useState } from "react"
import type { WeatherData, WeatherResponse } from "@/lib/weather"
import { CATEGORY_STYLES, isWeatherStale } from "@/lib/weather"

export function AirportWeather({ icao }: { icao: string }) {
  const [wx, setWx] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/weather?ids=${icao}`)
      .then(async (r) => {
        const data = (await r.json()) as WeatherResponse
        if (!r.ok) throw new Error(data.error || "Weather unavailable")
        return data
      })
      .then((data) => {
        setWx(data.weather[0] ?? null)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Weather unavailable")
        setLoading(false)
      })
  }, [icao])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading weather…</p>
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}. Verify conditions with an official briefing source.</p>
  }

  if (!wx) {
    return <p className="text-sm text-muted-foreground">No METAR available for this airport.</p>
  }

  const style = wx.category ? CATEGORY_STYLES[wx.category] : null
  const stale = isWeatherStale(wx)
  const parts: string[] = []
  if (wx.windDir !== null && wx.windSpeed !== null) parts.push(`Wind ${wx.windDir}° at ${wx.windSpeed} kts`)
  if (wx.visibility !== null) parts.push(`Vis ${wx.visibility} sm`)
  if (wx.tempC !== null) parts.push(`${wx.tempC}°C`)

  return (
    <div className="space-y-2">
      {style && wx.category && (
        <span className={`inline-block text-sm font-bold px-2.5 py-1 rounded ${style.badge}`}>{wx.category}</span>
      )}
      {parts.length > 0 && (
        <p className="text-sm text-muted-foreground">{parts.join(" · ")}</p>
      )}
      {wx.observedAt && (
        <p className="text-xs text-muted-foreground">Observed {new Date(wx.observedAt).toLocaleString()}</p>
      )}
      {stale && (
        <p role="alert" className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          Stale observation — do not use this report as current weather.
        </p>
      )}
      {wx.rawMetar && (
        <code className="block rounded bg-muted px-3 py-2 text-xs leading-relaxed text-foreground whitespace-pre-wrap">{wx.rawMetar}</code>
      )}
      <p className="text-xs text-muted-foreground">Advisory only. Verify weather with an official preflight briefing.</p>
    </div>
  )
}
