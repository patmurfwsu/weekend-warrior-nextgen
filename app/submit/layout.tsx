import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Submit an Airport",
  description: "Know a great on-field restaurant we're missing? Submit it and help grow the map.",
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
