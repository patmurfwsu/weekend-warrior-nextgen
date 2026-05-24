"use server"

import { stripe } from "@/lib/stripe"
import { DONATION_TIERS } from "@/lib/products"

export async function startCheckoutSession(productId: string): Promise<string> {
  if (!stripe) throw new Error("Stripe not configured — add STRIPE_SECRET_KEY to .env.local")

  const product = DONATION_TIERS.find((p) => p.id === productId)
  if (!product) throw new Error(`Donation tier "${productId}" not found`)

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  })

  if (!session.client_secret) throw new Error("No client secret returned from Stripe")
  return session.client_secret
}
