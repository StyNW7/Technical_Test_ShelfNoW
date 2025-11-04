"use client"

import { useState } from "react"
import { TransactionCard } from "@/components/transaction/transaction-card"
import { mockTransactions } from "@/lib/mock-transactions"
import { Search } from "lucide-react"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = mockTransactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.order.items.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0s" }}>
          <h1 className="text-4xl font-bold text-black md:text-5xl">Transaction History</h1>
          <p className="mt-2 text-lg text-gray-600">View and manage your order history</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative border-2 border-black bg-white">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              placeholder="Search by transaction ID, order ID, or book title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-0 bg-transparent py-3 pl-12 pr-4 text-black placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="animate-slide-up"
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                <TransactionCard transaction={transaction} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-black bg-white p-12 text-center">
            <p className="text-lg font-semibold text-gray-600">No transactions found</p>
            <p className="mt-2 text-gray-600">Try searching with different keywords</p>
            <a
              href="/shop"
              className="mt-6 inline-block border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              Continue Shopping
            </a>
          </div>
        )}
      </div>

    </main>
  )
}
