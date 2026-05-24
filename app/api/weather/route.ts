import { NextRequest, NextResponse } from "next/server"
import type { WeatherData } from "@/lib/weather"

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids")
  if (!ids) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${ids}&format=json`,
      { next: { revalidate: 600 } },
    )
    if (!res.ok) return NextResponse.json([])

    const data = await res.json()
    if (!Array.isArray(data)) return NextResponse.json([])

    const weather: WeatherData[] = data.map((m: any) => ({
      icao: m.icaoId,
      category: m.fltCat ?? null,
      windDir: m.wdir ?? null,
      windSpeed: m.wspd ?? null,
      visibility: typeof m.visib === "string" ? parseFloat(m.visib) : (m.visib ?? null),
      tempC: m.temp ?? null,
    }))

    return NextResponse.json(weather)
  } catch {
    return NextResponse.json([])
  }
}
