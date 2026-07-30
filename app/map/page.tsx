import type { Metadata } from "next"
import { AirportExplorer } from "@/components/airport-explorer"
import { airports } from "@/lib/airport-data"
import { SiteHeader } from "@/components/site-header"

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
      <SiteHeader compact showBackToHome />

      {/* Explorer: search, filter, map/list toggle */}
      <main className="flex-1 flex flex-col min-h-0">
        <AirportExplorer airports={airports} apiKey={apiKey} initialQuery={initialQuery} />
      </main>
    </div>
  )
}
