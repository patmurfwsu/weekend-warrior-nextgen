import Link from "next/link"
import { Plane, Heart, MapPin, UtensilsCrossed, PlusCircle, Cloud, Utensils } from "lucide-react"
import { airports } from "@/lib/airport-data"
import { NearbyAirports } from "@/components/nearby-airports"
import { HeroSearch } from "@/components/hero-search"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[560px] flex flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/runway-background.png)" }}
        />
        {/* Gradient overlay — darker at top for nav legibility, lighter mid-frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60" />

        {/* ── Nav (floating over hero) ─────────────────────────── */}
        <header className="relative z-20 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Plane className="w-7 h-7 text-white" />
              <span className="text-xl font-bold text-white tracking-tight">Weekend Warrior</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/map" className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/submit" className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors">
                Submit Airport
              </Link>
              <Link
                href="/donate"
                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Support</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Hero content ─────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 -mt-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] max-w-3xl drop-shadow-lg">
            Find your next<br />
            <span className="text-accent">$100 Hamburger</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/75 max-w-lg drop-shadow">
            The best on-airport restaurants across the US, found and loved by fellow GA pilots.
          </p>

          {/* Primary CTA */}
          <Link
            href="/map"
            className="mt-8 inline-flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
            <Plane className="w-5 h-5" />
            Explore the Map
          </Link>

          {/* Hero search */}
          <HeroSearch />

          {/* Secondary link — AllTrails-style underline link */}
          <Link
            href="/submit"
            className="mt-4 text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors"
          >
            Know a spot? Submit an airport →
          </Link>
        </div>
      </section>

      {/* ── AIRPORTS NEAR YOU ─────────────────────────────────────── */}
      <NearbyAirports airports={airports} />

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="bg-muted/40 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="mb-10 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">What is this?</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Your $100 hamburger, planned in minutes
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              The <span className="text-foreground font-medium">"$100 hamburger"</span> is a beloved GA tradition —
              named for the irony that a short local flight burns enough fuel to cost roughly $100 for a $12 burger.
              Weekend Warrior maps every on-airport restaurant we've found so you can turn a Saturday morning into a
              proper fly-out with almost no planning.
            </p>
          </div>

          {/* 3-step how it works */}
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Step 01</p>
                <h3 className="font-semibold text-foreground mb-1">Pick a destination</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse the map or search by airport code, name, or state. Tap any marker for restaurant photos,
                  ratings, and reviews.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Step 02</p>
                <h3 className="font-semibold text-foreground mb-1">Check the weather</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Live METARs update every 10 minutes. Marker colors tell you at a glance — green is VFR, red is IFR.
                  Plan your fuel stop around the food.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Step 03</p>
                <h3 className="font-semibold text-foreground mb-1">Land &amp; eat</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Taxi to the ramp, walk in, and order. You've earned your $100 hamburger. Save favorites to build your
                  own fly-out bucket list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BELOW-FOLD CONTENT ────────────────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-14 sm:space-y-20">

          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Find Airports</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Search by name, ICAO code, or state. Filter the map or browse a list — your choice.
              </p>
            </div>
            <div className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Discover Restaurants</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See real photos, ratings, and reviews pulled live from Google Maps on every marker.
              </p>
            </div>
            <div className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <PlusCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Share Your Find</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Know a hidden gem that's not on the map yet? Submit it and help the community grow.
              </p>
            </div>
          </div>

          {/* Bottom CTA strip */}
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-8 py-10 text-center">
            <h2 className="text-2xl font-bold text-foreground">Ready to fly somewhere new?</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              {airports.length} airports across the country — and growing.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Plane className="w-4 h-4" />
              Open the Map
            </Link>
          </div>

        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plane className="w-4 h-4" />
            <span className="text-sm font-medium">Weekend Warrior</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/map" className="hover:text-foreground transition-colors">Explore</Link>
            <Link href="/submit" className="hover:text-foreground transition-colors">Submit Airport</Link>
            <Link href="/donate" className="hover:text-foreground transition-colors">Support Us</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
