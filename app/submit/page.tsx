"use client"

import { useState } from "react"
import Link from "next/link"
import { Plane, ArrowLeft, CheckCircle, Send } from "lucide-react"
import { submitAirport } from "@/app/actions/submit"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
]

export default function SubmitPage() {
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const icao = ((formData.get("icao") as string) || "").toUpperCase()
    const state = formData.get("state") as string
    const airportName = (formData.get("airportName") as string) || ""
    const restaurantName = (formData.get("restaurantName") as string) || ""
    const description = (formData.get("description") as string) || ""
    const email = (formData.get("submitterEmail") as string) || ""

    const errors: Record<string, string> = {}
    if (!icao || !/^[A-Z0-9]{3,4}$/.test(icao)) {
      errors.icao = "Must be 3–4 letters or numbers (e.g. KCMA)"
    }
    if (!state) errors.state = "Please select a state"
    if (!airportName.trim()) errors.airportName = "Airport name is required"
    if (!restaurantName.trim()) errors.restaurantName = "Restaurant name is required"
    if (!description.trim()) errors.description = "Description is required"
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.submitterEmail = "Please enter a valid email address"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setPending(true)
    setError(null)

    formData.set("icao", icao)
    const result = await submitAirport(formData)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || "Something went wrong.")
    }
    setPending(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
          <Link href="/map" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground">Back to Map</span>
          </Link>
          <div className="flex items-center gap-2">
            <Plane className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-primary">Weekend Warrior</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
        {success ? (
          <div className="text-center space-y-4 py-16">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Thanks for the tip!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We&apos;ll review your submission and add it to the map if it checks out.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plane className="w-4 h-4" />
              Back to Map
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Submit an Airport</h2>
              <p className="text-muted-foreground">
                Know a great on-field restaurant that&apos;s not on the map yet? Tell us about it.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row: ICAO + State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="icao" className="text-sm font-medium text-foreground">
                    ICAO Code <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="icao"
                    name="icao"
                    maxLength={4}
                    placeholder="KCMA"
                    onChange={(e) => { e.target.value = e.target.value.toUpperCase() }}
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring uppercase ${
                      fieldErrors.icao ? "border-destructive" : "border-input"
                    }`}
                  />
                  {fieldErrors.icao && (
                    <p className="text-xs text-destructive">{fieldErrors.icao}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="state" className="text-sm font-medium text-foreground">
                    State <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      fieldErrors.state ? "border-destructive" : "border-input"
                    }`}
                  >
                    <option value="">Select…</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {fieldErrors.state && (
                    <p className="text-xs text-destructive">{fieldErrors.state}</p>
                  )}
                </div>
              </div>

              {/* Airport name */}
              <div className="space-y-1.5">
                <label htmlFor="airportName" className="text-sm font-medium text-foreground">
                  Airport Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="airportName"
                  name="airportName"
                  placeholder="Camarillo Airport"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    fieldErrors.airportName ? "border-destructive" : "border-input"
                  }`}
                />
                {fieldErrors.airportName && (
                  <p className="text-xs text-destructive">{fieldErrors.airportName}</p>
                )}
              </div>

              {/* Restaurant name */}
              <div className="space-y-1.5">
                <label htmlFor="restaurantName" className="text-sm font-medium text-foreground">
                  Restaurant Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="restaurantName"
                  name="restaurantName"
                  placeholder="Waypoint Cafe"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    fieldErrors.restaurantName ? "border-destructive" : "border-input"
                  }`}
                />
                {fieldErrors.restaurantName && (
                  <p className="text-xs text-destructive">{fieldErrors.restaurantName}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="What makes this place worth the flight?"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                    fieldErrors.description ? "border-destructive" : "border-input"
                  }`}
                />
                {fieldErrors.description && (
                  <p className="text-xs text-destructive">{fieldErrors.description}</p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs text-muted-foreground">Your contact info (optional — only used if we have questions)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="submitterName" className="text-sm font-medium text-foreground">Your Name</label>
                    <input
                      id="submitterName"
                      name="submitterName"
                      placeholder="Amelia Earhart"
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="submitterEmail" className="text-sm font-medium text-foreground">Your Email</label>
                    <input
                      id="submitterEmail"
                      name="submitterEmail"
                      type="email"
                      placeholder="pilot@example.com"
                      className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                        fieldErrors.submitterEmail ? "border-destructive" : "border-input"
                      }`}
                    />
                    {fieldErrors.submitterEmail && (
                      <p className="text-xs text-destructive">{fieldErrors.submitterEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {pending ? "Submitting…" : "Submit Airport"}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">Weekend Warrior • Find great airports worth flying to</p>
        </div>
      </footer>
    </div>
  )
}
