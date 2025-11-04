"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { CartItem } from "./mock-cart"

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { bookId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalItems, totalPrice }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.bookId === action.payload.bookId)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.bookId === action.payload.bookId ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
        const totals = calculateTotals(updatedItems)
        return { items: updatedItems, ...totals }
      }

      const newItems = [...state.items, action.payload]
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter((item) => item.bookId !== action.payload)
      const totals = calculateTotals(filteredItems)
      return { items: filteredItems, ...totals }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.bookId === action.payload.bookId ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item,
      )
      const totals = calculateTotals(updatedItems)
      return { items: updatedItems, ...totals }
    }

    case "CLEAR_CART": {
      return initialState
    }

    case "LOAD_CART": {
      const totals = calculateTotals(action.payload)
      return { items: action.payload, ...totals }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem("shelfnow-cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (error) {
        console.error("[v0] Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("shelfnow-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item })
  const removeItem = (bookId: string) => dispatch({ type: "REMOVE_ITEM", payload: bookId })
  const updateQuantity = (bookId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { bookId, quantity } })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
