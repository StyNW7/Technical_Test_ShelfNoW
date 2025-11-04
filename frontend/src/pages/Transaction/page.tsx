/* eslint-disable @typescript-eslint/no-explicit-any */
// Lokasi: frontend/src/app/transactions/page.tsx
"use client"

import { useState, useEffect } from "react"
import { TransactionCard } from "@/components/transaction/transaction-card"
// 1. Impor apiService dan tipe data Order
import { apiService, type Order } from "@/services/api"
import { Search, Loader2 } from "lucide-react"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  // 2. State untuk menyimpan data dari API
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Panggil fungsi API yang baru
        const userOrders = await apiService.getUserOrders();
        setOrders(userOrders)
      } catch (err: any) {
        console.error("Error fetching transactions:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, []) // Jalankan sekali saat mount

  // 4. Filter data 'orders' yang asli, bukan mock
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // (order.transaction?.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderItems.some((item) => 
        // Backend Anda tidak mengirim snapshot title, jadi kita cari berdasarkan productId
        item.productId.toLowerCase().includes(searchQuery.toLowerCase())
      ),
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-black md:text-5xl">Transaction History</h1>
          <p className="mt-2 text-lg text-gray-600">View and manage your order history</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative border-2 border-black bg-white">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              placeholder="Search by Order ID or Product ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-0 bg-transparent py-3 pl-12 pr-4 text-black placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
            <span className="ml-2 text-lg">Loading transactions...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="border-2 border-red-600 bg-red-50 p-12 text-center">
            <p className="text-lg font-semibold text-red-700">Failed to load transactions</p>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        )}

        {/* Transactions List */}
        {!isLoading && !error && filteredOrders.length > 0 && (
          <div className="grid gap-4 md:gap-6">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                className="animate-slide-up"
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                {/* 5. Kirim 'order' ke 'TransactionCard' */}
                <TransactionCard order={order} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredOrders.length === 0 && (
          <div className="border-2 border-black bg-white p-12 text-center">
            <p className="text-lg font-semibold text-gray-600">No transactions found</p>
            <p className="mt-2 text-gray-600">
              {searchQuery ? "Try searching with different keywords." : "You haven't placed any orders yet."}
            </p>
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