// Lokasi: frontend/src/components/transaction/transaction-card.tsx
"use client"

import { ChevronRight, Package } from "lucide-react"
// 1. Impor tipe Order dan OrderStatus
// 1. Impor tipe Order dan OrderStatus
import { OrderStatus, type Order} from "@/services/api"

// 2. Fungsi helper untuk warna status
export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "border-green-700 bg-green-50 text-green-700"
    case OrderStatus.SHIPPED:
      return "border-blue-700 bg-blue-50 text-blue-700"
    case OrderStatus.CANCELLED:
    case OrderStatus.REFUNDED:
      return "border-red-700 bg-red-50 text-red-700"
    case OrderStatus.PENDING:
      return "border-yellow-700 bg-yellow-50 text-yellow-700"
    default:
      return "border-gray-700 bg-gray-50 text-gray-700"
  }
}

interface TransactionCardProps {
  // 3. Terima 'order', bukan 'transaction'
  order: Order
}

export function TransactionCard({ order }: TransactionCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // 4. Ambil data dari 'order' dan 'transaction' di dalamnya
  const itemCount = order.orderItems.length
  const firstItem = order.orderItems[0]
  const transaction = order.transaction

  if (!transaction) {
    // Tampilkan placeholder jika transaksi masih PENDING (jarang terjadi)
    return (
      <div className="group relative border-2 border-dashed border-black bg-gray-50 p-6 opacity-60">
        <p>Order {order.id} is pending and has no transaction yet.</p>
      </div>
    )
  }

  return (
    // 5. Arahkan ke Order ID, bukan Transaction ID
    <a href={`/transactions/${order.id}`}>
      <div className="group relative border-2 border-black bg-white p-6 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white">
                  <Package size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600">Order ID</h3>
                  <p className="text-base font-bold text-black">{order.id}</p>
                </div>
              </div>
              <ChevronRight
                size={24}
                className="text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Product info (Gunakan data dari OrderItem) */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">
                {itemCount} {itemCount === 1 ? "item" : "items"} ordered
              </p>
              <p className="text-sm text-black line-clamp-1">
                {/* 6. Hapus 'title' karena tidak ada di skema OrderItem kita */}
                <span className="font-semibold">Product ID: {firstItem?.productId}</span>
                {itemCount > 1 && <span> + {itemCount - 1} more</span>}
              </p>
            </div>

            {/* Meta info (Gunakan status Order) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="text-sm">
                <span className="text-gray-600">Date: </span>
                <span className="font-semibold text-black">{formattedDate}</span>
              </div>
              <div className={`border px-3 py-1 text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
          </div>

          {/* Right section - Amount */}
          <div className="text-right space-y-2">
            <p className="text-sm text-gray-600">Total Amount</p>
            {/* 7. Ambil 'amount' dari 'transaction', bukan 'order' */}
            <p className="text-2xl font-bold text-black">${transaction.amount.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </a>
  )
}