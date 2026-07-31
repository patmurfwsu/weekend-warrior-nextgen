import Link from "next/link"
import { Plane, Map } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">
        <div className="mb-6 relative"><Plane className="w-14 h-14 text-primary rotate-12" /></div>
        <h1 className="text-4xl font-bold text-foreground mb-3">Lost in the clouds</h1>
        <p className="text-muted-foreground max-w-xs mb-8 leading-relaxed">This page doesn&apos;t exist. But there are plenty of restaurants and upcoming aviation events to discover.</p>
        <Link href="/map" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity">
          <Map className="w-4 h-4" />Back to the Map
        </Link>
        <Link href="/" className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">Or go home</Link>
      </main>
      <SiteFooter />
    </div>
  )
}
