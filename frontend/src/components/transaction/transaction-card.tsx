"use client"

import { ChevronRight, Package } from "lucide-react"
import type { Transaction } from "@/lib/mock-transactions"
import { getTransactionStatusColor } from "@/lib/mock-transactions"

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const formattedDate = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const itemCount = transaction.order.items.length
  const firstItem = transaction.order.items[0]

  return (
    <a href={`/transactions/${transaction.id}`}>
      <div className="group relative border-2 border-black bg-white p-6 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          {/* Left section */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white">
                  <Package size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600">Transaction ID</h3>
                  <p className="text-base font-bold text-black">{transaction.id}</p>
                </div>
              </div>
              <ChevronRight
                size={24}
                className="text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Product info */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">
                {itemCount} {itemCount === 1 ? "item" : "items"} ordered
              </p>
              <p className="text-sm text-black line-clamp-1">
                <span className="font-semibold">{firstItem?.title}</span>
                {itemCount > 1 && <span> + {itemCount - 1} more</span>}
              </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="text-sm">
                <span className="text-gray-600">Date: </span>
                <span className="font-semibold text-black">{formattedDate}</span>
              </div>
              <div className={`border px-3 py-1 text-xs font-bold ${getTransactionStatusColor(transaction.status)}`}>
                {transaction.status}
              </div>
            </div>
          </div>

          {/* Right section - Amount */}
          <div className="text-right space-y-2">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-black">${transaction.amount.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </a>
  )
}
