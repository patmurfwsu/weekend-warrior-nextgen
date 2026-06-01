"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Navigation, ChevronDown, MapPin, Plane } from "lucide-react"

interface NavigateDropdownProps {
  lat: number
  lng: number
  icao: string
  /** "list" = primary-colored button (list view cards); "popup" = blue button (map popup) */
  variant?: "list" | "popup"
}

/** Returns true only on iOS (iPhone/iPad/iPod) where foreflight:// deep links work. */
function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false)
  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent))
  }, [])
  return isIOS
}

export function NavigateDropdown({ lat, lng, icao, variant = "list" }: NavigateDropdownProps) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isIOS = useIsIOS()

  useEffect(() => { setMounted(true) }, [])

  const foreflightUrl = `foreflight://airports/${icao}`
  const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15`

  const buttonClass =
    variant === "popup"
      ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      : "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"

  // ── Non-iOS: open SkyVector chart (most useful for desktop flight planning) ─
  if (mounted && !isIOS) {
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

  // ── iOS (or pre-mount): dropdown with ForeFlight + Google Maps ───────────
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 88
      const top = spaceBelow >= menuHeight + 8
        ? rect.bottom + 4
        : rect.top - menuHeight - 4
      setMenuPos({ top, left: rect.left })
    }
    setOpen((v) => !v)
  }

  return (
    <>
      <button ref={buttonRef} onClick={handleToggle} className={buttonClass}>
        <Navigation className="w-3 h-3" />
        Navigate
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {mounted && open && createPortal(
        <div
          className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[172px]"
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={foreflightUrl}
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-gray-800 hover:bg-blue-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Plane className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            Open in ForeFlight
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-gray-800 hover:bg-blue-50 transition-colors border-t border-gray-100"
            onClick={() => setOpen(false)}
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            Google Maps
          </a>
        </div>,
        document.body,
      )}
    </>
  )
}
