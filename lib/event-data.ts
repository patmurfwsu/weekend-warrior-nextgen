export type AviationEventType = "airshow" | "fly-in" | "family" | "museum"

export interface AviationEvent {
  id: string
  title: string
  startDate: string
  endDate: string
  type: AviationEventType
  locationName: string
  cityState: string
  associatedAirport?: string
  lat: number
  lng: number
  summary: string
  arrivalGuidance: string
  officialUrl: string
  sourceName: string
  verifiedOn: string
  featured?: boolean
}

// Curated by the Weekend Warrior Event Scout. Every entry must link to an
// official organizer or aviation-organization source and include a verification date.
export const aviationEvents: AviationEvent[] = [
  {
    id: "scaleventure-2026",
    title: "ScaleVenture",
    startDate: "2026-10-17",
    endDate: "2026-10-17",
    type: "museum",
    locationName: "EAA Aviation Museum",
    cityState: "Oshkosh, WI",
    associatedAirport: "KOSH",
    lat: 43.9844,
    lng: -88.5569,
    summary: "A scale-model aviation event returning to the EAA Aviation Museum.",
    arrivalGuidance: "Museum event, not automatically a fly-in. Confirm airport access separately.",
    officialUrl: "https://www.eaa.org/eaa/about-eaa/eaa-media-room/eaa-news-releases/new-museum-events-2026",
    sourceName: "Experimental Aircraft Association",
    verifiedOn: "2026-10-05",
  },
  {
    id: "eaa-579-fly-in-drive-in-cook-out-2026",
    title: "EAA 579 Fly-In, Drive-In & Cook-Out",
    startDate: "2026-10-17",
    endDate: "2026-10-17",
    type: "fly-in",
    locationName: "Hinckley Airfield",
    cityState: "Hinckley, IL",
    lat: 41.7705636,
    lng: -88.70347425,
    summary: "A chapter fly-in, drive-in, and cook-out at Hinckley Airfield.",
    arrivalGuidance: "Listed as a fly-in. Check the EAA event page for the organizer's current arrival details.",
    officialUrl: "https://www.eaa.org/eaa/event/cmnewelleaa-579-flyin-drivein--cookout101720261130?id=7340674A01C74FCB8C3F6E63B9B2A4EC",
    sourceName: "Experimental Aircraft Association",
    verifiedOn: "2026-10-05",
    featured: true,
  },
  {
    id: "fall-flyin-conway-2026",
    title: "Fall Flyin",
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    type: "fly-in",
    locationName: "1718 Airport Road",
    cityState: "Conway, SC",
    lat: 33.8317341,
    lng: -79.1214155,
    summary: "A fall fly-in gathering in Conway.",
    arrivalGuidance: "Listed as a fly-in. Confirm arrival information with the organizer before departure.",
    officialUrl: "https://www.eaa.org/eaa/event/jesterfall-flyin102420261000?id=1D31824D4C6446CBA62D7E2F1068BBD3",
    sourceName: "Experimental Aircraft Association",
    verifiedOn: "2026-10-05",
  },
  {
    id: "fall-chili-fly-in-canton-2026",
    title: "Fall Chili Fly-In",
    startDate: "2026-11-07",
    endDate: "2026-11-07",
    type: "fly-in",
    locationName: "8512 North Lilley Road",
    cityState: "Canton, MI",
    lat: 42.3487451,
    lng: -83.45983,
    summary: "A fall fly-in centered on a chili gathering in Canton.",
    arrivalGuidance: "Listed as a fly-in. Check the organizer's event page for current arrival guidance.",
    officialUrl: "https://www.eaa.org/eaa/event/avee8rfall-chili-flyin110720261100?id=368DF410E2AB46B282BBD85132C26A51",
    sourceName: "Experimental Aircraft Association",
    verifiedOn: "2026-10-05",
  },
  {
    id: "monthly-fly-drive-breakfast-mcminnville-2026",
    title: "Monthly Fly-Drive-Bike-Walk Crawl Breakfast",
    startDate: "2026-12-19",
    endDate: "2026-12-19",
    type: "fly-in",
    locationName: "Big Hangar, 48 West Airport Road",
    cityState: "McMinnville, TN",
    lat: 35.7037341,
    lng: -85.8396507,
    summary: "A December breakfast gathering welcoming visitors who arrive by air or ground.",
    arrivalGuidance: "The listing welcomes fly-in arrivals; confirm current local procedures with the organizer.",
    officialUrl: "https://www.eaa.org/eaa/event/jplflymonthly-flydrivebikewalk-crawl-breakfast121920260730?id=0AFC678476E94189808E69B933D5B5AB",
    sourceName: "Experimental Aircraft Association",
    verifiedOn: "2026-10-05",
  },
]

export function getUpcomingEvents(referenceDate = new Date()): AviationEvent[] {
  const today = referenceDate.toISOString().slice(0, 10)
  return aviationEvents
    .filter((event) => event.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}
