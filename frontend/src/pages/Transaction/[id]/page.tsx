/* eslint-disable @typescript-eslint/no-explicit-any */
// Lokasi: frontend/src/app/transactions/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { TransactionDetailSection } from "@/components/transaction/transaction-detail-section"
// 1. Impor apiService, tipe Order, dan Loader
import { apiService, type Order } from "@/services/api"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom" // Gunakan useNavigate

export default function TransactionDetailPage() {
  const params = useParams()
  const orderId = params.id as string // Ini adalah ID Pesanan (Order)
  const navigate = useNavigate() // Gunakan hook navigasi

  // 2. State untuk data API
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. useEffect untuk mengambil data
  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          setIsLoading(true)
          setError(null)
          // Panggil fungsi API yang baru
          const orderData = await apiService.getOrder(orderId);
          setOrder(orderData)
        } catch (err: any) {
          console.error("Error fetching transaction details:", err)
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
      fetchOrder()
    }
  }, [orderId])

  // 4. Tampilkan state Loading
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-lg">Loading transaction details...</p>
        </div>
      </main>
    )
  }

  // 5. Tampilkan state Error atau Not Found
  if (error || !order) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="border-2 border-red-600 bg-red-50 p-12 text-center">
            <h1 className="text-2xl font-bold text-red-700">Transaction Not Found</h1>
            <p className="mt-4 text-red-600">{error || "The transaction you're looking for doesn't exist."}</p>
            <button
              onClick={() => navigate('/transaction')}
              className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              <ArrowLeft size={20} />
              Back to Transactions
            </button>
          </div>
        </div>
      </main>
    )
  }

  // 6. Tampilkan konten jika data berhasil dimuat
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/transaction')}
            className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-bold text-black transition-all hover:bg-black hover:text-white"
          >
            <ArrowLeft size={20} />
            Back to Transactions
          </button>
        </div>

        {/* Detail Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Kirim 'order' ke 'TransactionDetailSection' */}
          <TransactionDetailSection order={order} />
        </div>
      </div>
    </main>
  )
}