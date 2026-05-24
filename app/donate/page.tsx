"use client"

import Link from "next/link"
import { Plane, Heart, Coffee, Fuel, UtensilsCrossed } from "lucide-react"
import { DONATION_TIERS } from "@/lib/products"
import type React from "react"

const STRIPE_LINK = "https://buy.stripe.com/test_9B64gBgpj5f3fqVftx04801"

const ICONS: Record<string, React.ReactNode> = {
  coffee: <Coffee className="w-6 h-6" />,
  avgas: <Fuel className="w-6 h-6" />,
  hamburger: <UtensilsCrossed className="w-6 h-6" />,
}

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-[oklch(0.14_0.07_260)] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Plane className="w-7 h-7 text-white" />
            <span className="text-xl font-bold text-white tracking-tight">Weekend Warrior</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/map" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Explore Map
            </Link>
            <Link href="/submit" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors">
              Submit Airport
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Support Weekend Warrior</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your support helps us find and verify more $100 hamburger spots across the country. Every contribution goes toward keeping the map free and growing.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {DONATION_TIERS.map((tier) => (
              <a
                key={tier.id}
                href={STRIPE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-lg p-6 text-left hover:border-primary hover:bg-card/80 transition-colors group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{ICONS[tier.id]}</div>
                <h3 className="font-semibold text-foreground mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <p className="text-2xl font-bold text-primary">${(tier.priceInCents / 100).toFixed(0)}</p>
              </a>
            ))}
          </div>

          <div className="text-center">
            <a
              href={STRIPE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-lg"
            >
              <Heart className="w-5 h-5" />
              Support the Project
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Weekend Warrior • Find great airports worth flying to
          </p>
        </div>
      </footer>
    </div>
  )
}
