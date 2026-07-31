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
    id: "seafair-2026",
    title: "Boeing Seafair Air Show",
    startDate: "2026-08-01",
    endDate: "2026-08-02",
    type: "airshow",
    locationName: "Lake Washington",
    cityState: "Seattle, WA",
    associatedAirport: "KBFI",
    lat: 47.6062,
    lng: -122.2015,
    summary: "A waterfront airshow weekend featuring the U.S. Navy Blue Angels.",
    arrivalGuidance: "Not a fly-in. Review the official event site and local airspace restrictions before planning.",
    officialUrl: "https://www.blueangels.navy.mil/assets/docs/schedules/show-2026.pdf",
    sourceName: "U.S. Navy Blue Angels",
    verifiedOn: "2026-07-31",
    featured: true,
  },
  {
    id: "oregon-international-air-show-2026",
    title: "Oregon International Air Show",
    startDate: "2026-08-15",
    endDate: "2026-08-16",
    type: "airshow",
    locationName: "McMinnville Municipal Airport",
    cityState: "McMinnville, OR",
    associatedAirport: "KMMV",
    lat: 45.1944,
    lng: -123.1359,
    summary: "A weekend airshow scheduled to feature the U.S. Navy Blue Angels.",
    arrivalGuidance: "Airshow operations may limit airport access. Confirm arrival procedures with the organizer.",
    officialUrl: "https://www.blueangels.navy.mil/assets/docs/schedules/show-2026.pdf",
    sourceName: "U.S. Navy Blue Angels",
    verifiedOn: "2026-07-31",
    featured: true,
  },
  {
    id: "yellowstone-international-air-show-2026",
    title: "Yellowstone International Air Show",
    startDate: "2026-08-22",
    endDate: "2026-08-23",
    type: "airshow",
    locationName: "Billings Logan International Airport",
    cityState: "Billings, MT",
    associatedAirport: "KBIL",
    lat: 45.8077,
    lng: -108.5429,
    summary: "A two-day aviation event scheduled to feature the U.S. Navy Blue Angels.",
    arrivalGuidance: "Not presented as a fly-in. Check the organizer's spectator and airport-access instructions.",
    officialUrl: "https://www.blueangels.navy.mil/assets/docs/schedules/show-2026.pdf",
    sourceName: "U.S. Navy Blue Angels",
    verifiedOn: "2026-07-31",
  },
  {
    id: "air-capital-fly-in-2026",
    title: "63rd Annual Air Capital Fly-In",
    startDate: "2026-09-05",
    endDate: "2026-09-05",
    type: "fly-in",
    locationName: "Colonel James Jabara Airport",
    cityState: "Wichita, KS",
    associatedAirport: "KAAO",
    lat: 37.7476,
    lng: -97.2211,
    summary: "EAA Chapter 88's annual Wichita fly-in and chapter breakfast gathering.",
    arrivalGuidance: "Fly-in event. Review KAAO procedures and nearby Class D airspace before departure.",
    officialUrl: "https://chapters.eaa.org/eaa88",
    sourceName: "EAA Chapter 88",
    verifiedOn: "2026-07-31",
    featured: true,
  },
  {
    id: "cleveland-national-air-show-2026",
    title: "Cleveland National Air Show",
    startDate: "2026-09-05",
    endDate: "2026-09-07",
    type: "airshow",
    locationName: "Burke Lakefront Airport",
    cityState: "Cleveland, OH",
    associatedAirport: "KBKL",
    lat: 41.5175,
    lng: -81.6833,
    summary: "Labor Day weekend airshow scheduled to feature the U.S. Navy Blue Angels.",
    arrivalGuidance: "The show venue is an operating airport with event restrictions. Do not assume fly-in access.",
    officialUrl: "https://www.blueangels.navy.mil/assets/docs/schedules/show-2026.pdf",
    sourceName: "U.S. Navy Blue Angels",
    verifiedOn: "2026-07-31",
    featured: true,
  },
  {
    id: "thacker-field-fall-fly-in-2026",
    title: "Thacker Field Fall Fly-In Weekend",
    startDate: "2026-09-18",
    endDate: "2026-09-19",
    type: "fly-in",
    locationName: "Thacker Field",
    cityState: "Chenoa, IL",
    associatedAirport: "11LL",
    lat: 40.7359,
    lng: -88.7334,
    summary: "A Friday gathering followed by a Saturday pancake breakfast on a private grass strip.",
    arrivalGuidance: "Private-use field. Review the chapter's current arrival information before flying in.",
    officialUrl: "https://chapters.eaa.org/eaa129/fly-in-events",
    sourceName: "EAA Chapter 129",
    verifiedOn: "2026-07-31",
  },
  {
    id: "roads-and-runways-2026",
    title: "Roads and Runways",
    startDate: "2026-09-19",
    endDate: "2026-09-19",
    type: "family",
    locationName: "EAA Aviation Museum",
    cityState: "Oshkosh, WI",
    associatedAirport: "KOSH",
    lat: 43.9844,
    lng: -88.5569,
    summary: "A family-focused museum event bringing vehicles and aviation together at Pioneer Airport.",
    arrivalGuidance: "Museum event, not automatically a fly-in. Confirm airport access separately.",
    officialUrl: "https://www.eaa.org/eaa/about-eaa/eaa-media-room/eaa-news-releases/new-museum-events-2026",
    sourceName: "Experimental Aircraft Association",
    verifiedOn: "2026-07-31",
  },
  {
    id: "mcas-miramar-air-show-2026",
    title: "MCAS Miramar Air Show",
    startDate: "2026-09-26",
    endDate: "2026-09-27",
    type: "airshow",
    locationName: "Marine Corps Air Station Miramar",
    cityState: "San Diego, CA",
    associatedAirport: "KNKX",
    lat: 32.8684,
    lng: -117.1425,
    summary: "A military aviation weekend scheduled to feature the U.S. Navy Blue Angels.",
    arrivalGuidance: "Military installation—not a GA fly-in. Follow official spectator access instructions.",
    officialUrl: "https://www.blueangels.navy.mil/assets/docs/schedules/show-2026.pdf",
    sourceName: "U.S. Navy Blue Angels",
    verifiedOn: "2026-07-31",
  },
  {
    id: "grand-junction-air-show-2026",
    title: "Grand Junction Air Show",
    startDate: "2026-10-03",
    endDate: "2026-10-04",
    type: "airshow",
    locationName: "Grand Junction Regional Airport",
    cityState: "Grand Junction, CO",
    associatedAirport: "KGJT",
    lat: 39.1224,
    lng: -108.5267,
    summary: "Western Colorado airshow weekend scheduled to feature the U.S. Navy Blue Angels.",
    arrivalGuidance: "Check event-day airport restrictions and use the official organizer's access guidance.",
    officialUrl: "https://www.blueangels.navy.mil/assets/docs/schedules/show-2026.pdf",
    sourceName: "U.S. Navy Blue Angels",
    verifiedOn: "2026-07-31",
  },
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
    verifiedOn: "2026-07-31",
  },
]

export function getUpcomingEvents(referenceDate = new Date()): AviationEvent[] {
  const today = referenceDate.toISOString().slice(0, 10)
  return aviationEvents
    .filter((event) => event.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}
