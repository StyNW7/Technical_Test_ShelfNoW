/* eslint-disable @typescript-eslint/no-explicit-any */
export type CartItem = {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookImage?: string
  quantity: number
  price: number
  stock: number
}

export type Cart = {
  id: string
  userId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

export type OrderItem = {
  id: string
  productId: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  userId: string
  totalAmount: number
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export type Transaction = {
  id: string
  orderId: string
  userId: string
  amount: number
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED"
  paymentMethod: string
  paymentDetails?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Mock cart data
export const mockCartItems: CartItem[] = []

export const mockOrders: Order[] = [
  {
    id: "order-001",
    userId: "user-1",
    totalAmount: 89.98,
    status: "DELIVERED",
    items: [
      { id: "item-1", productId: "1", quantity: 1, price: 28.99 },
      { id: "item-2", productId: "2", quantity: 2, price: 30.0 },
    ],
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-11-01"),
  },
  {
    id: "order-002",
    userId: "user-1",
    totalAmount: 55.98,
    status: "SHIPPED",
    items: [{ id: "item-3", productId: "3", quantity: 2, price: 27.99 }],
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-11-02"),
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    orderId: "order-001",
    userId: "user-1",
    amount: 89.98,
    status: "COMPLETED",
    paymentMethod: "Credit Card",
    paymentDetails: { lastFour: "4242", brand: "Visa" },
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-10-15"),
  },
]
