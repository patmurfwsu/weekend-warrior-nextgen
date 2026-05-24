import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Weekend Warrior — Find Your Next $100 Hamburger",
    template: "%s | Weekend Warrior",
  },
  description:
    "Discover the best on-airport restaurants across the US. Search, filter, and explore on-field dining for general aviation pilots.",
  openGraph: {
    title: "Weekend Warrior — Find Your Next $100 Hamburger",
    description:
      "Discover the best on-airport restaurants across the US. Search, filter, and explore on-field dining for general aviation pilots.",
    images: [{ url: "/runway-background.png", width: 1200, height: 630, alt: "Weekend Warrior" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekend Warrior — Find Your Next $100 Hamburger",
    description: "The best on-airport restaurants across the US, for GA pilots.",
    images: ["/runway-background.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
