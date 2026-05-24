export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const DONATION_TIERS: Product[] = [
  {
    id: "coffee",
    name: "Buy us a Coffee",
    description: "Help keep the runway lights on",
    priceInCents: 100, // $1.00
  },
  {
    id: "avgas",
    name: "Chip in for AvGas",
    description: "Help fuel our next airport visit",
    priceInCents: 100, // $1.00
  },
  {
    id: "hamburger",
    name: "The $100 Hamburger",
    description: "The classic pilot donation",
    priceInCents: 100, // $1.00
  },
]
