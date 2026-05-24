import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support Weekend Warrior",
  description: "Help us find and verify more $100 hamburger spots across the country.",
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
