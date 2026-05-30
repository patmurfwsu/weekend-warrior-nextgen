"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function HeroSearch() {
  const [value, setValue] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) {
      router.push(`/map?q=${encodeURIComponent(q)}`)
    } else {
      router.push("/map")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search airports or restaurants…"
          className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/15 border border-white/25 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/25 text-white text-sm font-semibold rounded-full transition-colors"
      >
        Search
      </button>
    </form>
  )
}
