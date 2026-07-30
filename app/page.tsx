import Link from "next/link"
import { MapPin, UtensilsCrossed, PlusCircle, Plane } from "lucide-react"
import { airports } from "@/lib/airport-data"
import { NearbyAirports } from "@/components/nearby-airports"
import { HeroSearch } from "@/components/hero-search"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

/* ── Targeting-corner bracket helper ──────────────────────── */
function TargetCorners({ className = "" }: { className?: string }) {
  const brass = "border-[oklch(0.67_0.13_72/0.55)]"
  return (
    <>
      <div className={`absolute top-5 left-5 w-9 h-9 border-t-2 border-l-2 ${brass} ${className}`} />
      <div className={`absolute top-5 right-5 w-9 h-9 border-t-2 border-r-2 ${brass} ${className}`} />
      <div className={`absolute bottom-5 left-5 w-9 h-9 border-b-2 border-l-2 ${brass} ${className}`} />
      <div className={`absolute bottom-5 right-5 w-9 h-9 border-b-2 border-r-2 ${brass} ${className}`} />
    </>
  )
}

/* ── Star divider ──────────────────────────────────────────── */
function StarDivider({ stars = 3, light = false }: { stars?: number; light?: boolean }) {
  const color = light ? "text-[oklch(0.67_0.13_72/0.45)]" : "text-[oklch(0.67_0.13_72/0.6)]"
  const line  = light ? "bg-[oklch(0.67_0.13_72/0.2)]" : "bg-border/60"
  return (
    <div className="flex items-center gap-3 my-1">
      <span className={`flex-1 h-px ${line}`} />
      <span className={`${color} text-xs tracking-[0.3em]`}>{"★".repeat(stars)}</span>
      <span className={`flex-1 h-px ${line}`} />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ════════════════════════════════════════════════════════
          NAV — dark olive command bar
          ════════════════════════════════════════════════════════ */}
      <SiteHeader />

      {/* ════════════════════════════════════════════════════════
          HERO — mission briefing
          ════════════════════════════════════════════════════════ */}
      <section className="relative h-[88vh] min-h-[580px] flex flex-col overflow-hidden">
        {/* Runway photo */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/runway-background.png)" }} />
        {/* Sepia-olive tint — desaturate & warm */}
        <div className="absolute inset-0 bg-[oklch(0.30_0.075_82/0.38)] mix-blend-multiply" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/10 to-black/52" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,220,150,0.20),transparent_42%)]" />
        {/* Scanline texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 4px)" }} />

        {/* Targeting-corner brackets */}
        <TargetCorners />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-2">

          {/* Unit designation stamp */}
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-12 bg-[oklch(0.67_0.13_72/0.5)]" />
            <p className="mission-label text-[oklch(0.67_0.13_72)] tracking-[0.35em]">
              ✦ Classified · Mission Briefing ✦
            </p>
            <span className="h-px w-12 bg-[oklch(0.67_0.13_72/0.5)]" />
          </div>

          {/* Stars / rank insignia */}
          <div className="mb-4 text-[oklch(0.67_0.13_72/0.75)] tracking-[0.4em] text-base">★ ★ ★ ★ ★</div>

          {/* Main headline */}
          <h1 className="font-display font-bold uppercase leading-[0.92] tracking-tight drop-shadow-2xl">
            <span className="block text-4xl sm:text-6xl lg:text-7xl text-white/90">Find Your Next</span>
            <span
              className="block text-6xl sm:text-8xl lg:text-[7rem] text-[oklch(0.67_0.13_72)]"
              style={{ textShadow: "0 0 40px oklch(0.67 0.13 72 / 0.35), 0 2px 0 rgba(0,0,0,0.5)" }}
            >
              $100 Hamburger
            </span>
          </h1>

          {/* Typewriter sub-copy */}
          <p className="mt-5 text-sm sm:text-base font-stamp text-white/55 max-w-sm drop-shadow tracking-wide leading-relaxed">
            The best on-airport restaurants across the U.S.<br />
            Scouted and rated by fellow GA pilots.
          </p>

          {/* Star divider */}
          <div className="flex items-center gap-3 my-5 w-48 mx-auto">
            <span className="flex-1 h-px bg-[oklch(0.67_0.13_72/0.3)]" />
            <span className="text-[oklch(0.67_0.13_72/0.6)] text-[0.6rem] tracking-[0.4em]">★ ★ ★</span>
            <span className="flex-1 h-px bg-[oklch(0.67_0.13_72/0.3)]" />
          </div>

          {/* CTA */}
          <Link
            href="/map"
            className="inline-flex items-center gap-3 px-9 py-3.5
              bg-[oklch(0.30_0.08_130)] text-[oklch(0.94_0.03_84)]
              font-display font-bold text-sm uppercase tracking-[0.18em]
              border border-[oklch(0.45_0.09_130)]
              hover:bg-[oklch(0.26_0.07_130)] active:scale-95
              transition-all shadow-2xl"
          >
            <Plane className="w-4 h-4" />
            Scramble the Map
          </Link>

          {/* Hero search */}
          <HeroSearch />

          {/* Submit link */}
          <Link href="/submit" className="mt-4 mission-label text-white/40 hover:text-white/65 underline underline-offset-4 transition-colors">
            Know a spot? Submit an airport →
          </Link>
        </div>

        {/* Bottom brass tape */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.67_0.13_72/0.6)] to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════
          AIRPORTS NEAR YOU
          ════════════════════════════════════════════════════════ */}
      <NearbyAirports airports={airports} />

      {/* ════════════════════════════════════════════════════════
          FIELD ORDERS — how it works
          ════════════════════════════════════════════════════════ */}
      <section className="texture-paper tactical-grid bg-muted/40 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-2 border-b-2 border-border relative overflow-hidden">
        {/* Top olive tape */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[oklch(0.30_0.08_130/0.35)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[oklch(0.30_0.08_130/0.35)]" />

        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px flex-1 max-w-[3rem] bg-border/60" />
              <p className="mission-label text-primary tracking-[0.3em]">◈ Field Orders ◈</p>
              <span className="h-px flex-1 max-w-[3rem] bg-border/60" />
            </div>
            <h2 className="font-display font-bold text-foreground uppercase text-3xl sm:text-4xl tracking-tight leading-none mb-4">
              Your Mission: $100 Hamburger
            </h2>
            <StarDivider />
            <p className="font-stamp text-muted-foreground max-w-2xl leading-relaxed mt-4 text-[0.92rem]">
              The <span className="text-foreground font-medium">&ldquo;$100 hamburger&rdquo;</span> is a beloved GA tradition —
              named for the irony that a short local flight burns enough fuel to cost roughly $100 for a $12 burger.
              Weekend Warrior maps every on-airport restaurant we&apos;ve found so you can turn a Saturday morning into a
              proper fly-out with almost no planning.
            </p>
          </div>

          {/* 3 orders */}
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {/* Order 01 */}
            <div className="relative pl-5 border-l-2 border-primary/30">
              <p className="mission-label text-[oklch(0.67_0.13_72)] mb-2 tracking-[0.25em]">Order — 01</p>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-lg leading-tight mb-2">
                Pick a Destination
              </h3>
              <div className="w-6 h-0.5 bg-primary/40 mb-3" />
              <p className="font-stamp text-sm text-muted-foreground leading-relaxed">
                Browse the map or search by airport code, name, or state. Tap any marker for restaurant photos,
                ratings, and reviews.
              </p>
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary/50" />
            </div>

            {/* Order 02 */}
            <div className="relative pl-5 border-l-2 border-primary/30">
              <p className="mission-label text-[oklch(0.67_0.13_72)] mb-2 tracking-[0.25em]">Order — 02</p>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-lg leading-tight mb-2">
                Check the Weather
              </h3>
              <div className="w-6 h-0.5 bg-primary/40 mb-3" />
              <p className="font-stamp text-sm text-muted-foreground leading-relaxed">
                Live METARs update every 10 minutes. Marker colors tell you at a glance — green is VFR, red is IFR.
                Plan your fuel stop around the food.
              </p>
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary/50" />
            </div>

            {/* Order 03 */}
            <div className="relative pl-5 border-l-2 border-primary/30">
              <p className="mission-label text-[oklch(0.67_0.13_72)] mb-2 tracking-[0.25em]">Order — 03</p>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-lg leading-tight mb-2">
                Land &amp; Eat
              </h3>
              <div className="w-6 h-0.5 bg-primary/40 mb-3" />
              <p className="font-stamp text-sm text-muted-foreground leading-relaxed">
                Taxi to the ramp, walk in, and order. You&apos;ve earned your $100 hamburger. Save favorites to build your
                own fly-out bucket list.
              </p>
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          INTELLIGENCE REPORT — feature cards
          ════════════════════════════════════════════════════════ */}
      <section className="tactical-grid-dark bg-[oklch(0.18_0.06_118)] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[oklch(0.25_0.05_110)]">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Section header */}
          <div className="text-center">
            <p className="mission-label text-[oklch(0.67_0.13_72/0.8)] mb-3 tracking-[0.3em]">
              ◈ Intelligence Report ◈
            </p>
            <h2 className="font-display font-bold text-[oklch(0.88_0.03_85)] uppercase text-3xl sm:text-4xl tracking-tight mb-2">
              Your Complete Tactical Kit
            </h2>
            <StarDivider light />
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="riveted relative bg-[oklch(0.92_0.04_85)] border border-[oklch(0.68_0.05_78)] p-7 pt-9 group hover:border-[oklch(0.67_0.13_72/0.7)] hover:shadow-[0_0_20px_oklch(0.67_0.13_72/0.12)] transition-all">
              {/* Unit badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-[oklch(0.30_0.08_130)] bg-[oklch(0.92_0.04_85)] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <p className="mission-label text-primary mb-2 tracking-[0.2em]">Nav · 01</p>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-base mb-3">
                Find Airports
              </h3>
              <div className="w-8 h-0.5 bg-accent/40 mb-3" />
              <p className="font-stamp text-sm text-muted-foreground leading-relaxed">
                Search by name, ICAO code, or state. Filter the map or browse a list — your choice.
              </p>
            </div>

            {/* Card 2 */}
            <div className="riveted relative bg-[oklch(0.92_0.04_85)] border border-[oklch(0.68_0.05_78)] p-7 pt-9 group hover:border-[oklch(0.67_0.13_72/0.7)] hover:shadow-[0_0_20px_oklch(0.67_0.13_72/0.12)] transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-[oklch(0.67_0.13_72)] bg-[oklch(0.92_0.04_85)] flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-accent" />
              </div>
              <p className="mission-label text-[oklch(0.67_0.13_72)] mb-2 tracking-[0.2em]">Intel · 02</p>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-base mb-3">
                Discover Restaurants
              </h3>
              <div className="w-8 h-0.5 bg-accent/40 mb-3" />
              <p className="font-stamp text-sm text-muted-foreground leading-relaxed">
                Real photos, ratings, and reviews pulled live from Google Maps on every marker.
              </p>
            </div>

            {/* Card 3 */}
            <div className="riveted relative bg-[oklch(0.92_0.04_85)] border border-[oklch(0.68_0.05_78)] p-7 pt-9 group hover:border-[oklch(0.67_0.13_72/0.7)] hover:shadow-[0_0_20px_oklch(0.67_0.13_72/0.12)] transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-[oklch(0.30_0.08_130)] bg-[oklch(0.92_0.04_85)] flex items-center justify-center">
                <PlusCircle className="w-4 h-4 text-primary" />
              </div>
              <p className="mission-label text-primary mb-2 tracking-[0.2em]">Recon · 03</p>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-base mb-3">
                Share Your Find
              </h3>
              <div className="w-8 h-0.5 bg-accent/40 mb-3" />
              <p className="font-stamp text-sm text-muted-foreground leading-relaxed">
                Know a hidden gem not on the map? Submit it and help the community grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          MISSION APPROVED — CTA
          ════════════════════════════════════════════════════════ */}
      <section className="texture-paper bg-background py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="riveted-full relative border-2 border-primary/25 bg-primary/5 px-8 py-14 text-center overflow-hidden">
            {/* Corner accent lines */}
            <span className="absolute top-5 left-14 right-14 h-px bg-primary/15" />
            <span className="absolute bottom-5 left-14 right-14 h-px bg-primary/15" />

            {/* Large decorative stars */}
            <div className="text-[oklch(0.67_0.13_72/0.2)] text-4xl mb-4 tracking-[0.5em]">★ ★ ★</div>

            {/* Status stamp */}
            <div className="inline-block mb-4">
              <p className="mission-label text-primary tracking-[0.3em]">
                ◈ Mission Status: Approved ◈
              </p>
            </div>

            <h2 className="font-display font-bold text-foreground uppercase text-3xl sm:text-4xl tracking-tight mb-3">
              Ready to Fly Somewhere New?
            </h2>

            <StarDivider />

            <p className="font-stamp text-muted-foreground mt-3 mb-8 text-base">
              {airports.length} airports across the country — and growing.
            </p>

            <Link
              href="/map"
              className="inline-flex items-center gap-3 px-10 py-3.5
                bg-[oklch(0.30_0.08_130)] text-[oklch(0.94_0.03_84)]
                font-display font-bold text-sm uppercase tracking-[0.18em]
                border border-[oklch(0.45_0.09_130)]
                hover:bg-[oklch(0.26_0.07_130)] active:scale-95
                transition-all shadow-lg"
            >
              <Plane className="w-4 h-4" />
              Open the Map
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════ */}
      <SiteFooter />

    </div>
  )
}
