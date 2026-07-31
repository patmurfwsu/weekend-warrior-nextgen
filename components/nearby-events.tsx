"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CalendarRange } from "lucide-react"
import { EventCard } from "@/components/event-card"
import type { AviationEvent } from "@/lib/event-data"

interface LocatedEvent extends AviationEvent { distanceNm?: number }

function distanceNm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radiusNm = 3440.1
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return radiusNm * 2 * Math.asin(Math.sqrt(a))
}

export function NearbyEvents({ events }: { events: AviationEvent[] }) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => undefined,
      { timeout: 6000 },
    )
  }, [])

  const visibleEvents = useMemo<LocatedEvent[]>(() => {
    if (location) {
      const nearby = events
        .map((event) => ({ ...event, distanceNm: distanceNm(location.lat, location.lng, event.lat, event.lng) }))
        .filter((event) => (event.distanceNm ?? Infinity) <= 250)
        .sort((a, b) => (a.distanceNm ?? 0) - (b.distanceNm ?? 0) || a.startDate.localeCompare(b.startDate))
        .slice(0, 4)
      if (nearby.length > 0) return nearby
    }
    return [...events]
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.startDate.localeCompare(b.startDate))
      .slice(0, 4)
  }, [events, location])

  if (events.length === 0) return null

  return (
    <section className="texture-paper border-y-2 border-border bg-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mission-label mb-2 tracking-[0.3em] text-primary">◈ Weekend Radar ◈</p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">Upcoming Missions {location ? "Near You" : "Worth Watching"}</h2>
            <p className="mt-2 max-w-2xl font-stamp text-sm text-muted-foreground">Curated fly-ins, airshows and aviation events. Always confirm details and arrival restrictions with the organizer.</p>
          </div>
          <Link href="/events" className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary hover:text-accent"><CalendarRange className="h-4 w-4" />View all events</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleEvents.map((event) => <EventCard key={event.id} event={event} distanceNm={event.distanceNm} />)}
        </div>
      </div>
    </section>
  )
}
