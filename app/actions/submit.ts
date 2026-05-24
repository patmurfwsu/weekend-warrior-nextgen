"use server"

export async function submitAirport(formData: FormData) {
  const formspreeId = process.env.FORMSPREE_ID

  if (!formspreeId) {
    return { success: false, error: "Submission is not configured yet." }
  }

  const payload = {
    icao: formData.get("icao"),
    airportName: formData.get("airportName"),
    state: formData.get("state"),
    restaurantName: formData.get("restaurantName"),
    description: formData.get("description"),
    submitterName: formData.get("submitterName"),
    submitterEmail: formData.get("submitterEmail"),
  }

  const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return { success: false, error: "Submission failed. Please try again." }
  }

  return { success: true }
}
