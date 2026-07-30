import Image from "next/image"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-[oklch(0.55_0.09_72/0.35)] bg-[oklch(0.89_0.045_82)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" aria-label="Weekend Warrior home">
          <Image src="/ww-logo-transparent.png" alt="Weekend Warrior" width={1774} height={887} className="h-16 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-5 mission-label text-primary/70">
          <Link href="/map" className="hover:text-primary">Explore</Link>
          <Link href="/submit" className="hover:text-primary">Submit</Link>
          <Link href="/donate" className="hover:text-primary">Support</Link>
        </div>
      </div>
    </footer>
  )
}
