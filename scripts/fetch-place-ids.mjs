// One-off script to look up Google Place IDs for airports missing them.
// Run: node scripts/fetch-place-ids.mjs
// Reads GOOGLE_MAPS_API_KEY from .env.local

import { readFileSync, writeFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

// Read API key from .env.local
const envFile = readFileSync(join(root, ".env.local"), "utf8")
const apiKey = envFile.match(/GOOGLE_MAPS_API_KEY=(.+)/)?.[1]?.trim()
if (!apiKey) {
  console.error("GOOGLE_MAPS_API_KEY not found in .env.local")
  process.exit(1)
}

const airports = [
  { icao: "KAVX", name: "Catalina Airport",                    restaurant: "Airport in the Sky",      lat: 33.4049, lng: -118.4165 },
  { icao: "KMYF", name: "Montgomery-Gibbs Executive Airport",  restaurant: "94th Aero Squadron",      lat: 32.8157, lng: -117.1396 },
  { icao: "KHAF", name: "Half Moon Bay Airport",               restaurant: "Cameron's Pub & Restaurant", lat: 37.5134, lng: -122.5009 },
  { icao: "KSEZ", name: "Sedona Airport",                      restaurant: "Mesa Grill",              lat: 34.8486, lng: -111.7885 },
  { icao: "KFFZ", name: "Falcon Field Airport",                restaurant: "Saguaro Grille",          lat: 33.4608, lng: -111.7280 },
  { icao: "KSPG", name: "Albert Whitted Airport",              restaurant: "The Hangar Restaurant",   lat: 27.7658, lng: -82.6268  },
  { icao: "KLAL", name: "Lakeland Linder International",       restaurant: "Barnstormer Grill",       lat: 27.9889, lng: -82.0186  },
  { icao: "KOSH", name: "Wittman Regional Airport",            restaurant: "Friar Tuck's Inn",        lat: 43.9844, lng: -88.5570  },
  { icao: "KFLD", name: "Fond du Lac County Airport",          restaurant: "Pioneer Inn",             lat: 43.7718, lng: -88.4886  },
  { icao: "KFDK", name: "Frederick Municipal Airport",         restaurant: "The Perfect Landing",     lat: 39.4176, lng: -77.3742  },
  { icao: "KGAI", name: "Montgomery County Airpark",           restaurant: "Vitali's Cafe",           lat: 39.1684, lng: -77.1660  },
  { icao: "KFNL", name: "Northern Colorado Regional Airport",  restaurant: "The Hangar at FNL",       lat: 40.4518, lng: -104.0267 },
  { icao: "KFLY", name: "Meadow Lake Airport",                 restaurant: "Meadow Lake Cafe",        lat: 38.9459, lng: -104.5697 },
  { icao: "KGTU", name: "Georgetown Municipal Airport",        restaurant: "Blue Hangar Cafe",        lat: 30.6788, lng: -97.6794  },
  { icao: "KTTD", name: "Troutdale Airport",                   restaurant: "The Black Bear Diner",    lat: 45.5490, lng: -122.4012 },
  { icao: "KHEF", name: "Manassas Regional Airport",           restaurant: "The Hangar Bar & Grill",  lat: 38.7214, lng: -77.5153  },
  { icao: "KSBP", name: "San Luis Obispo County Regional Airport", restaurant: "Spirit of San Luis Restaurant", lat: 35.2368, lng: -120.6426 },
  { icao: "KPAE", name: "Paine Field",                         restaurant: "The Spotted Cow Grill",   lat: 47.9063, lng: -122.2816 },
  { icao: "KSGJ", name: "Northeast Florida Regional Airport",  restaurant: "Barnstormer Grill",       lat: 29.9592, lng: -81.3398  },
  { icao: "KCDW", name: "Essex County Airport",                restaurant: "Runway Cafe",             lat: 40.8752, lng: -74.2814  },
  { icao: "KPDK", name: "DeKalb-Peachtree Airport",           restaurant: "57th Fighter Group Restaurant", lat: 33.8757, lng: -84.3022 },
  { icao: "KFTW", name: "Fort Worth Meacham International Airport", restaurant: "The Aeroclub Restaurant", lat: 32.8196, lng: -97.3622 },
  { icao: "KMKO", name: "Muskogee-Davis Regional Airport",     restaurant: "Arnie's Restaurant",      lat: 35.6560, lng: -95.3667  },
]

async function searchPlace(airport) {
  const query = encodeURIComponent(`${airport.restaurant} ${airport.name}`)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${airport.lat},${airport.lng}&radius=3000&key=${apiKey}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.status !== "OK" || !data.results?.length) {
    return { found: false, status: data.status }
  }
  const top = data.results[0]
  return {
    found: true,
    placeId: top.place_id,
    googleName: top.name,
    address: top.formatted_address,
    nameMismatch: !top.name.toLowerCase().includes(airport.restaurant.toLowerCase().split(" ")[0].toLowerCase()),
  }
}

const results = []

for (const airport of airports) {
  process.stdout.write(`Looking up ${airport.icao} — ${airport.restaurant}... `)
  const result = await searchPlace(airport)

  if (!result.found) {
    console.log(`❌ NOT FOUND (status: ${result.status})`)
    results.push({ icao: airport.icao, storedName: airport.restaurant, found: false })
  } else {
    const flag = result.nameMismatch ? " ⚠️  NAME MISMATCH" : " ✅"
    console.log(`${flag}`)
    console.log(`   placeId:     ${result.placeId}`)
    console.log(`   Google name: ${result.googleName}`)
    console.log(`   Address:     ${result.address}`)
    results.push({
      icao: airport.icao,
      storedName: airport.restaurant,
      found: true,
      placeId: result.placeId,
      googleName: result.googleName,
      address: result.address,
      nameMismatch: result.nameMismatch,
    })
  }
  console.log()
}

writeFileSync(join(root, "scripts/place-id-results.json"), JSON.stringify(results, null, 2))
console.log("Results saved to scripts/place-id-results.json")
