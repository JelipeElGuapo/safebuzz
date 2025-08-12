"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  description?: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
          })
        }
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }

        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })
      },
      removeFromCart: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
      get total() {
        return Number(
          get()
            .items.reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2),
        )
      },
    }),
    {
      name: "safebuzz-cart",
    },
  ),
)
