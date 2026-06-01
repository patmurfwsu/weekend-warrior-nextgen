"use client"

import { Navigation } from "lucide-react"

interface NavigateDropdownProps {
  icao: string
  /** "list" = primary-colored button (list view cards); "popup" = blue button (map popup) */
  variant?: "list" | "popup"
}

export function NavigateDropdown({ icao, variant = "list" }: NavigateDropdownProps) {
  const buttonClass =
    variant === "popup"
      ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      : "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"

  return (
    <a
      href={`https://skyvector.com/airport/${icao}`}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
    >
      <Navigation className="w-3 h-3" />
      Navigate
    </a>
  )
}
