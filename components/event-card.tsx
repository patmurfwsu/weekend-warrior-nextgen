import { CalendarDays, ExternalLink, MapPin, Plane } from "lucide-react"
import type { AviationEvent } from "@/lib/event-data"

const typeLabels: Record<AviationEvent["type"], string> = {
  airshow: "Airshow",
  "fly-in": "Fly-In",
  family: "Family Event",
  museum: "Museum Event",
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T12:00:00Z`)
  const end = new Date(`${endDate}T12:00:00Z`)
  const format = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
  return startDate === endDate ? format.format(start) : `${format.format(start)}–${format.format(end)}`
}

export function EventCard({ event, distanceNm }: { event: AviationEvent; distanceNm?: number }) {
  return (
    <article className="riveted flex h-full flex-col border border-[oklch(0.68_0.05_78)] bg-[oklch(0.94_0.035_84)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[oklch(0.67_0.13_72/0.7)] hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="mission-label bg-primary/10 px-2 py-1 text-primary">{typeLabels[event.type]}</span>
        {typeof distanceNm === "number" && (
          <span className="font-mono text-xs font-semibold text-muted-foreground">{Math.round(distanceNm)} NM</span>
        )}
      </div>
      <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-foreground">{event.title}</h3>
      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-accent" />{formatDateRange(event.startDate, event.endDate)}</p>
        <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{event.locationName} · {event.cityState}</span></p>
        {event.associatedAirport && (
          <p className="flex items-center gap-2 font-mono text-xs font-semibold text-primary"><Plane className="h-4 w-4" />Associated airport: {event.associatedAirport}</p>
        )}
      </div>
      <p className="mt-4 font-stamp text-sm leading-relaxed text-muted-foreground">{event.summary}</p>
      <p className="mt-3 border-l-2 border-accent/40 pl-3 text-xs leading-relaxed text-muted-foreground">{event.arrivalGuidance}</p>
      <div className="mt-auto pt-5">
        <a href={event.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary hover:text-accent">
          Confirm with organizer <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <p className="mt-2 text-[0.65rem] text-muted-foreground/70">{event.sourceName} · verified {event.verifiedOn}</p>
      </div>
    </article>
  )
}
