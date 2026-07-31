import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support Weekend Warrior",
  description: "Help us find and verify more restaurant destinations and upcoming aviation events.",
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
