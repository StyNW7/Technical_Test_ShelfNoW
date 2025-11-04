// Mock transaction data matching the schema
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED"

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  title: string
  author: string
}

export type Order = {
  id: string
  userId: string
  totalAmount: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export type Transaction = {
  id: string
  orderId: string
  userId: string
  amount: number
  status: TransactionStatus
  paymentMethod: string
  paymentDetails: {
    cardLast4?: string
    cardBrand?: string
    email?: string
  }
  createdAt: Date
  updatedAt: Date
  order: Order
}

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    orderId: "ORD-001",
    userId: "user-1",
    amount: 89.97,
    status: "COMPLETED",
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardLast4: "4242",
      cardBrand: "Visa",
    },
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-11-01"),
    order: {
      id: "ORD-001",
      userId: "user-1",
      totalAmount: 89.97,
      status: "DELIVERED",
      createdAt: new Date("2025-11-01"),
      updatedAt: new Date("2025-11-03"),
      items: [
        {
          id: "item-1",
          orderId: "ORD-001",
          productId: "1",
          quantity: 2,
          price: 28.99,
          title: "The Midnight Library",
          author: "Matt Haig",
        },
        {
          id: "item-2",
          orderId: "ORD-001",
          productId: "3",
          quantity: 1,
          price: 27.99,
          title: "Piranesi",
          author: "Susanna Clarke",
        },
      ],
    },
  },
  {
    id: "TXN-002",
    orderId: "ORD-002",
    userId: "user-1",
    amount: 32.5,
    status: "COMPLETED",
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardLast4: "1111",
      cardBrand: "Mastercard",
    },
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-10-28"),
    order: {
      id: "ORD-002",
      userId: "user-1",
      totalAmount: 32.5,
      status: "SHIPPED",
      createdAt: new Date("2025-10-28"),
      updatedAt: new Date("2025-11-02"),
      items: [
        {
          id: "item-3",
          orderId: "ORD-002",
          productId: "2",
          quantity: 1,
          price: 32.5,
          title: "Atomic Habits",
          author: "James Clear",
        },
      ],
    },
  },
  {
    id: "TXN-003",
    orderId: "ORD-003",
    userId: "user-1",
    amount: 60.99,
    status: "COMPLETED",
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardLast4: "5555",
      cardBrand: "Visa",
    },
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-10-15"),
    order: {
      id: "ORD-003",
      userId: "user-1",
      totalAmount: 60.99,
      status: "DELIVERED",
      createdAt: new Date("2025-10-15"),
      updatedAt: new Date("2025-10-20"),
      items: [
        {
          id: "item-4",
          orderId: "ORD-003",
          productId: "4",
          quantity: 1,
          price: 30.0,
          title: "The Psychology of Money",
          author: "Morgan Housel",
        },
        {
          id: "item-5",
          orderId: "ORD-003",
          productId: "5",
          quantity: 1,
          price: 29.99,
          title: "The Seven Husbands of Evelyn Hugo",
          author: "Taylor Jenkins Reid",
        },
      ],
    },
  },
  {
    id: "TXN-004",
    orderId: "ORD-004",
    userId: "user-1",
    amount: 31.99,
    status: "COMPLETED",
    paymentMethod: "PayPal",
    paymentDetails: {
      email: "user@example.com",
    },
    createdAt: new Date("2025-10-10"),
    updatedAt: new Date("2025-10-10"),
    order: {
      id: "ORD-004",
      userId: "user-1",
      totalAmount: 31.99,
      status: "DELIVERED",
      createdAt: new Date("2025-10-10"),
      updatedAt: new Date("2025-10-15"),
      items: [
        {
          id: "item-6",
          orderId: "ORD-004",
          productId: "6",
          quantity: 1,
          price: 31.99,
          title: "Educated",
          author: "Tara Westover",
        },
      ],
    },
  },
  {
    id: "TXN-005",
    orderId: "ORD-005",
    userId: "user-1",
    amount: 55.98,
    status: "COMPLETED",
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardLast4: "9999",
      cardBrand: "Amex",
    },
    createdAt: new Date("2025-09-28"),
    updatedAt: new Date("2025-09-28"),
    order: {
      id: "ORD-005",
      userId: "user-1",
      totalAmount: 55.98,
      status: "DELIVERED",
      createdAt: new Date("2025-09-28"),
      updatedAt: new Date("2025-10-03"),
      items: [
        {
          id: "item-7",
          orderId: "ORD-005",
          productId: "7",
          quantity: 1,
          price: 26.99,
          title: "Klara and the Sun",
          author: "Kazuo Ishiguro",
        },
        {
          id: "item-8",
          orderId: "ORD-005",
          productId: "8",
          quantity: 1,
          price: 28.99,
          title: "The Invisible Life of Addie LaRue",
          author: "V.E. Schwab",
        },
      ],
    },
  },
]

export const getTransactionStatusColor = (status: TransactionStatus): string => {
  switch (status) {
    case "COMPLETED":
      return "text-green-700 bg-green-50 border-green-200"
    case "PENDING":
      return "text-yellow-700 bg-yellow-50 border-yellow-200"
    case "FAILED":
      return "text-red-700 bg-red-50 border-red-200"
    case "REFUNDED":
      return "text-blue-700 bg-blue-50 border-blue-200"
    case "CANCELLED":
      return "text-gray-700 bg-gray-50 border-gray-200"
    default:
      return "text-gray-700 bg-gray-50 border-gray-200"
  }
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "DELIVERED":
      return "text-green-700 bg-green-50 border-green-200"
    case "SHIPPED":
      return "text-blue-700 bg-blue-50 border-blue-200"
    case "PROCESSING":
      return "text-yellow-700 bg-yellow-50 border-yellow-200"
    case "CONFIRMED":
      return "text-indigo-700 bg-indigo-50 border-indigo-200"
    case "PENDING":
      return "text-gray-700 bg-gray-50 border-gray-200"
    case "CANCELLED":
      return "text-red-700 bg-red-50 border-red-200"
    case "REFUNDED":
      return "text-orange-700 bg-orange-50 border-orange-200"
    default:
      return "text-gray-700 bg-gray-50 border-gray-200"
  }
}
