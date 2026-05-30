import type { Metadata } from "next"
import Link from "next/link"
import { Plane, Heart } from "lucide-react"
import { AirportExplorer } from "@/components/airport-explorer"
import { airports } from "@/lib/airport-data"

export const metadata: Metadata = {
  title: "Explore Airports",
  description: `Browse ${airports.length} on-airport restaurants on an interactive map. Search by ICAO code, airport name, or state.`,
}

// searchParams is a Promise in Next.js 15+ — must be async/awaited
export default async function MapPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || ""
  const { q } = await searchParams
  const initialQuery = q ?? ""

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="z-10 bg-[oklch(0.14_0.07_260)] border-b border-white/10">
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

      {/* Explorer: search, filter, map/list toggle */}
      <main className="flex-1 flex flex-col min-h-0">
        <AirportExplorer airports={airports} apiKey={apiKey} initialQuery={initialQuery} />
      </main>
    </div>
  )
}
