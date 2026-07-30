import { NextRequest, NextResponse } from "next/server"
import type { WeatherData } from "@/lib/weather"

export async function GET(req: NextRequest) {
  const rawIds = req.nextUrl.searchParams.get("ids")
  if (!rawIds) return NextResponse.json({ weather: [] })

  const ids = rawIds
    .split(",")
    .map((id) => id.trim().toUpperCase())
    .filter(Boolean)

  if (ids.length > 250 || ids.some((id) => !/^[A-Z0-9]{3,4}$/.test(id))) {
    return NextResponse.json({ weather: [], error: "Invalid airport identifiers." }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(ids.join(","))}&format=json`,
      { cache: "no-store", signal: AbortSignal.timeout(10_000) },
    )
    if (!res.ok) {
      return NextResponse.json({ weather: [], error: "Aviation weather is temporarily unavailable." }, { status: 502 })
    }

    const data = await res.json()
    if (!Array.isArray(data)) {
      return NextResponse.json({ weather: [], error: "Aviation weather returned an unexpected response." }, { status: 502 })
    }

    const weather: WeatherData[] = data.map((m: any) => ({
      icao: m.icaoId,
      category: m.fltCat ?? null,
      windDir: m.wdir ?? null,
      windSpeed: m.wspd ?? null,
      visibility: typeof m.visib === "string" ? parseFloat(m.visib) : (m.visib ?? null),
      tempC: m.temp ?? null,
      observedAt: m.reportTime ?? m.obsTime ?? null,
      rawMetar: m.rawOb ?? null,
    }))

    return NextResponse.json(
      { weather },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } },
    )
  } catch {
    return NextResponse.json({ weather: [], error: "Aviation weather is temporarily unavailable." }, { status: 502 })
  }
}
