export interface WeatherData {
  icao: string
  category: "VFR" | "MVFR" | "IFR" | "LIFR" | null
  windDir: number | null
  windSpeed: number | null
  visibility: number | null
  tempC: number | null
}

export const CATEGORY_STYLES: Record<string, { badge: string; hex: string; textHex: string; markerHex: string }> = {
  VFR:  { badge: "bg-green-100 text-green-700",   hex: "#dcfce7", textHex: "#15803d", markerHex: "#16a34a" },
  MVFR: { badge: "bg-blue-100 text-blue-700",     hex: "#dbeafe", textHex: "#1d4ed8", markerHex: "#2563eb" },
  IFR:  { badge: "bg-red-100 text-red-700",       hex: "#fee2e2", textHex: "#b91c1c", markerHex: "#dc2626" },
  LIFR: { badge: "bg-purple-100 text-purple-700", hex: "#f3e8ff", textHex: "#7e22ce", markerHex: "#9333ea" },
}
