"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function Checkout({ productId, onComplete }: { productId: string; onComplete?: () => void }) {
  const fetchClientSecret = useCallback(() => startCheckoutSession(productId), [productId])

  if (!stripeKey) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center">
        <p className="text-muted-foreground text-sm">
          Payments not configured — add{" "}
          <code className="bg-background border border-border rounded px-1 py-0.5 text-xs font-mono">
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          </code>{" "}
          and{" "}
          <code className="bg-background border border-border rounded px-1 py-0.5 text-xs font-mono">
            STRIPE_SECRET_KEY
          </code>{" "}
          to .env.local
        </p>
      </div>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret, onComplete }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
