"use server"

import { headers } from "next/headers"

const US_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
])

const attempts = new Map<string, number[]>()
const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 5

function value(formData: FormData, key: string, maxLength: number) {
  const entry = formData.get(key)
  return typeof entry === "string" ? entry.trim().slice(0, maxLength) : ""
}

export async function submitAirport(formData: FormData) {
  const formspreeId = process.env.FORMSPREE_ID

  if (!formspreeId) return { success: false, error: "Submission is not configured yet." }

  // Honeypot field: real users never see or fill this input.
  if (value(formData, "company", 100)) return { success: true }

  const headerList = await headers()
  const clientId = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const now = Date.now()
  const recentAttempts = (attempts.get(clientId) || []).filter((time) => now - time < RATE_WINDOW_MS)
  if (recentAttempts.length >= RATE_LIMIT) {
    return { success: false, error: "Too many submissions. Please try again later." }
  }

  const payload = {
    icao: value(formData, "icao", 4).toUpperCase(),
    airportName: value(formData, "airportName", 120),
    state: value(formData, "state", 2).toUpperCase(),
    restaurantName: value(formData, "restaurantName", 120),
    description: value(formData, "description", 1000),
    submitterName: value(formData, "submitterName", 100),
    submitterEmail: value(formData, "submitterEmail", 254),
  }

  if (!/^[A-Z0-9]{3,4}$/.test(payload.icao)) {
    return { success: false, error: "Enter a valid 3–4 character airport identifier." }
  }
  if (!US_STATES.has(payload.state)) return { success: false, error: "Select a valid state." }
  if (!payload.airportName || !payload.restaurantName || !payload.description) {
    return { success: false, error: "Airport, restaurant, and description are required." }
  }
  if (payload.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.submitterEmail)) {
    return { success: false, error: "Enter a valid email address." }
  }

  attempts.set(clientId, [...recentAttempts, now])

  try {
    const res = await fetch(`https://formspree.io/f/${encodeURIComponent(formspreeId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) return { success: false, error: "Submission failed. Please try again." }
    return { success: true }
  } catch {
    return { success: false, error: "Submission service is unavailable. Please try again later." }
  }
}
