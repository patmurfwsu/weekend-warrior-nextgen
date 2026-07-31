import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"

interface SiteHeaderProps {
  compact?: boolean
  showBackToHome?: boolean
}

export function SiteHeader({ compact = false, showBackToHome = false }: SiteHeaderProps) {
  return (
    <header className="relative z-50 shrink-0 border-b border-[oklch(0.55_0.09_72/0.45)] bg-[oklch(0.94_0.035_84/0.96)] shadow-[0_2px_14px_rgba(53,39,18,0.12)] backdrop-blur-md">
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8 ${compact ? "h-[72px]" : "h-[86px]"}`}>
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {showBackToHome && (
            <Link href="/" aria-label="Back to home" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[oklch(0.58_0.08_78/0.55)] bg-white/45 text-primary shadow-sm transition hover:-translate-x-0.5 hover:bg-white/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <Link href="/" className="group block min-w-0" aria-label="Weekend Warrior home">
            <Image src="/ww-logo-transparent.png" alt="Weekend Warrior — P-51 logo" width={1774} height={887} priority className={`w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] ${compact ? "h-[62px] sm:h-[68px]" : "h-[72px] sm:h-[80px]"}`} />
          </Link>
        </div>
        <nav aria-label="Primary navigation" className="flex shrink-0 items-center gap-3 sm:gap-6">
          <Link href="/map" className="mission-label hidden text-primary/75 transition-colors hover:text-primary sm:block">Explore</Link>
          <Link href="/events" className="mission-label hidden text-primary/75 transition-colors hover:text-primary sm:block">Events</Link>
          <Link href="/submit" className="mission-label hidden text-primary/75 transition-colors hover:text-primary md:block">Submit Airport</Link>
          <Link href="/donate" className="mission-label inline-flex items-center gap-1.5 text-primary/75 transition-colors hover:text-primary">
            <Heart className="h-3.5 w-3.5" /><span className="hidden sm:inline">Support</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
