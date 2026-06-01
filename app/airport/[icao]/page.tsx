import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Plane, Heart, ArrowLeft, Fuel, Clock, Mountain, MapPin, ExternalLink } from "lucide-react"
import { airports } from "@/lib/airport-data"
import { AirportWeather } from "@/components/airport-weather"

export function generateStaticParams() {
  return airports.map((a) => ({ icao: a.icao.toLowerCase() }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ icao: string }>
}): Promise<Metadata> {
  const { icao } = await params
  const airport = airports.find((a) => a.icao.toLowerCase() === icao.toLowerCase())
  if (!airport) return {}
  return {
    title: `${airport.restaurant.name} at ${airport.name}`,
    description: airport.restaurant.description,
    openGraph: {
      title: `${airport.restaurant.name} — ${airport.icao}`,
      description: airport.restaurant.description,
    },
  }
}

export default async function AirportPage({
  params,
}: {
  params: Promise<{ icao: string }>
}) {
  const { icao } = await params
  const airport = airports.find((a) => a.icao.toLowerCase() === icao.toLowerCase())
  if (!airport) notFound()

  const { elevation, fuel, hours } = airport

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[oklch(0.14_0.07_260)] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Plane className="w-7 h-7 text-white" />
            <span className="text-xl font-bold text-white tracking-tight">Weekend Warrior</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/submit"
              className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Submit Airport
            </Link>
            <Link
              href="/donate"
              className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Support</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to map
        </Link>

        {/* Airport identity */}
        <div className="flex items-start gap-4">
          <span className="text-xl font-bold font-mono bg-primary/10 text-primary px-3 py-1.5 rounded-lg shrink-0">
            {airport.icao}
          </span>
          <div>
            <div className="text-sm font-medium text-muted-foreground">{airport.state}</div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{airport.name}</h1>
          </div>
        </div>

        {/* Restaurant */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">{airport.restaurant.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {airport.restaurant.description}
            </p>
          </div>

          {(elevation !== undefined || fuel || hours) && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
              {elevation !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mountain className="w-3.5 h-3.5 shrink-0" />
                  {elevation.toLocaleString()} ft MSL
                </div>
              )}
              {fuel && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Fuel className="w-3.5 h-3.5 shrink-0" />
                  {fuel === "both" ? "100LL · Jet-A" : fuel === "none" ? "No fuel on field" : fuel}
                </div>
              )}
              {hours && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {hours}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <a
              href={`https://maps.google.com/maps?q=${airport.lat},${airport.lng}&z=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <MapPin className="w-4 h-4" />
              Get directions
            </a>
            {airport.restaurant.website && (
              <a
                href={airport.restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Restaurant website
              </a>
            )}
          </div>
        </div>

        {/* Live weather */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Current Conditions</h3>
          <AirportWeather icao={airport.icao} />
        </div>

        {/* Pilot links */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Pilot Resources</h3>
          <div className="flex flex-wrap gap-2">
            <a
              href={`foreflight://airports/${airport.icao}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open in ForeFlight
            </a>
            <a
              href={`https://skyvector.com/airport/${airport.icao}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              SkyVector Chart
            </a>
            <a
              href={`https://www.airnav.com/airport/${airport.icao}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              AirNav Info
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
