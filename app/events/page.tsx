import type { Metadata } from "next"
import { CalendarRange } from "lucide-react"
import { EventCard } from "@/components/event-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getUpcomingEvents } from "@/lib/event-data"

export const metadata: Metadata = {
  title: "Upcoming Aviation Events | Weekend Warrior",
  description: "Curated fly-ins, airshows, museum days and family aviation events from official organizer sources.",
}

export default function EventsPage() {
  const events = getUpcomingEvents()
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="texture-paper tactical-grid border-b-2 border-border bg-muted/40 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <CalendarRange className="mx-auto mb-4 h-9 w-9 text-accent" />
            <p className="mission-label mb-3 tracking-[0.3em] text-primary">◈ Weekend Radar ◈</p>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-6xl">Upcoming Aviation Events</h1>
            <p className="mx-auto mt-4 max-w-2xl font-stamp leading-relaxed text-muted-foreground">
              A small, verified collection of fly-ins, airshows and aviation experiences. Weekend Warrior does not control these events—confirm details and airport access with the organizer before departing.
            </p>
          </div>
        </section>
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {events.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <div className="border border-dashed border-border py-16 text-center">
                <p className="font-display text-xl font-bold uppercase text-foreground">No current missions posted</p>
                <p className="mt-2 text-sm text-muted-foreground">The Event Scout will check again during its next scheduled sweep.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
