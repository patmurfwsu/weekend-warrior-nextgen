import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Weekend Warrior",
    short_name: "Warrior",
    description: "Discover restaurants and aviation events for memorable GA flights",
    start_url: "/",
    display: "standalone",
    background_color: "#f3e6cc",
    theme_color: "#33472b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
