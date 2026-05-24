"use client"

import { useState, useCallback } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = localStorage.getItem("ww-favorites")
      return new Set(stored ? JSON.parse(stored) : [])
    } catch {
      return new Set()
    }
  })

  const toggle = useCallback((icao: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(icao)) {
        next.delete(icao)
      } else {
        next.add(icao)
      }
      try {
        localStorage.setItem("ww-favorites", JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [])

  return { favorites, toggle }
}
