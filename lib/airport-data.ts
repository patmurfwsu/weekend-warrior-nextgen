export interface Airport {
  icao: string
  name: string
  state: string
  restaurant: {
    name: string
    description: string
    placeId?: string
  }
  lat: number
  lng: number
}

export const airports: Airport[] = [
  // California
  {
    icao: "KCMA",
    name: "Camarillo Airport",
    state: "CA",
    restaurant: {
      name: "Waypoint Cafe",
      description: "Popular SoCal fly-in destination with excellent breakfast and lunch.",
      placeId: "ChIJ51cOKpFJ6IAR1yenlNwQQSw",
    },
    lat: 34.2137,
    lng: -119.0943,
  },
  {
    icao: "KSZP",
    name: "Santa Paula Airport",
    state: "CA",
    restaurant: {
      name: "The Flying Spoon",
      description: "Charming cafe at a historic aviation community airport.",
      placeId: "ChIJsdo0BBW16YARPGiBo4fTET4",
    },
    lat: 34.3472,
    lng: -119.0612,
  },
  {
    icao: "KAVX",
    name: "Catalina Airport",
    state: "CA",
    restaurant: {
      name: "Airport in the Sky Restaurant",
      description: "Legendary hilltop restaurant on Santa Catalina Island. The flight alone is worth it.",
      placeId: "ChIJz5si5J5v3YARkt-Ky_4dfp8",
    },
    lat: 33.4049,
    lng: -118.4165,
  },
  {
    icao: "KMYF",
    name: "Montgomery-Gibbs Executive Airport",
    state: "CA",
    restaurant: {
      name: "94th Aero Squadron",
      description: "WWII-themed restaurant and a beloved San Diego institution since 1974.",
      placeId: "ChIJzYIHtKT_24ARXYWXYzHMjJQ",
    },
    lat: 32.8157,
    lng: -117.1396,
  },
  {
    icao: "KHAF",
    name: "Half Moon Bay Airport",
    state: "CA",
    restaurant: {
      name: "Cameron's Pub & Restaurant",
      description: "British-style pub a short walk from the ramp with great coastal views.",
      placeId: "ChIJiWN7JkQLj4ARfe0bzQO7OOM",
    },
    lat: 37.5134,
    lng: -122.5009,
  },
  // Arizona
  {
    icao: "KSEZ",
    name: "Sedona Airport",
    state: "AZ",
    restaurant: {
      name: "Mesa Grill",
      description: "Perched atop Airport Mesa with jaw-dropping red rock views in every direction.",
      placeId: "ChIJTUgkR8umLYcReX_a7wyurvg",
    },
    lat: 34.8486,
    lng: -111.7885,
  },
  // Florida
  {
    icao: "KCEW",
    name: "Bob Sikes Airport",
    state: "FL",
    restaurant: {
      name: "Stick & Rudder",
      description: "Classic $100 hamburger spot right next to the ramp.",
      placeId: "ChIJB4XvpeV1kYgR6NuND9BiMQY",
    },
    lat: 30.7789,
    lng: -86.5221,
  },
  {
    icao: "KSPG",
    name: "Albert Whitted Airport",
    state: "FL",
    restaurant: {
      name: "The Hangar Restaurant & Flight Lounge",
      description: "Waterfront dining on Tampa Bay with seaplane activity and stunning sunsets.",
      placeId: "ChIJTUtvaZrhwogRSkZnTR1DnR8",
    },
    lat: 27.7658,
    lng: -82.6268,
  },
  {
    icao: "KLAL",
    name: "Lakeland Linder International",
    state: "FL",
    restaurant: {
      name: "Sora Eatery",
      description: "Upstairs at the terminal with runway views — home of Sun 'n Fun and great food year-round.",
      placeId: "ChIJTVWkLaI53YgRJLdDS9WFH1M",
    },
    lat: 27.9889,
    lng: -82.0186,
  },
  // Alabama
  {
    icao: "K0J4",
    name: "Florala Municipal Airport",
    state: "AL",
    restaurant: {
      name: "Blade and Wing Cafe",
      description: "Southern hospitality with great views of the runway.",
      placeId: "ChIJdTJHJz3xkYgRCWlvEmFC8qU",
    },
    lat: 31.0425,
    lng: -86.3116,
  },
  // Wisconsin
  {
    icao: "KOSH",
    name: "Wittman Regional Airport",
    state: "WI",
    restaurant: {
      name: "Friar Tuck's",
      description: "The go-to spot in Oshkosh — a short hop from the field and legendary during AirVenture week.",
      placeId: "ChIJqRMFZcDuA4gREqJJAne4vZo",
    },
    lat: 43.9844,
    lng: -88.5570,
  },
  // Maryland
  {
    icao: "KGAI",
    name: "Montgomery County Airpark",
    state: "MD",
    restaurant: {
      name: "Café Sophie",
      description: "Upstairs in the terminal building — friendly counter-service spot beloved by the local GA community.",
      placeId: "ChIJ2a_7HTHTt4kR3tKgiYJpTkk",
    },
    lat: 39.1684,
    lng: -77.1660,
  },
  // Maryland
  {
    icao: "KFDK",
    name: "Frederick Municipal Airport",
    state: "MD",
    restaurant: {
      name: "The Perfect Landing",
      description: "Rooftop deck overlooking Frederick's runway — one of the Mid-Atlantic's best fly-in meals.",
    },
    lat: 39.4176,
    lng: -77.3742,
  },
  // California
  {
    icao: "KSBP",
    name: "San Luis Obispo County Regional Airport",
    state: "CA",
    restaurant: {
      name: "Spirit of San Luis Restaurant",
      description: "Legendary Central California fly-in with ocean breezes and a front porch view of the ramp.",
      placeId: "ChIJr0US8bj27IARj2KF4cRaXWI",
    },
    lat: 35.2368,
    lng: -120.6426,
  },
  // Florida
  {
    icao: "KSGJ",
    name: "Northeast Florida Regional Airport",
    state: "FL",
    restaurant: {
      name: "Hangar One Bistro Eatery & Bar",
      description: "On-field bistro at St. Augustine's historic general aviation airport — great views of the oldest airfield in Florida.",
      placeId: "ChIJAe_wm-kp5IgR5OH3g_0TQCE",
    },
    lat: 29.9592,
    lng: -81.3398,
  },
  // Georgia
  {
    icao: "KPDK",
    name: "DeKalb-Peachtree Airport",
    state: "GA",
    restaurant: {
      name: "The 57th Fighter Group Restaurant",
      description: "WWII-themed restaurant at Peachtree-DeKalb with authentic warbird décor and a legendary Sunday brunch.",
      placeId: "ChIJc4aS7FsI9YgRhk3Yyqjf9EA",
    },
    lat: 33.8757,
    lng: -84.3022,
  },
]
