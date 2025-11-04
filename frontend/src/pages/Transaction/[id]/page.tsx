"use client"

import { TransactionDetailSection } from "@/components/transaction/transaction-detail-section"
import { mockTransactions } from "@/lib/mock-transactions"
import { ArrowLeft } from "lucide-react"
import { useParams } from "react-router"

export default function TransactionDetailPage() {
  const params = useParams()
  const transactionId = params.id as string

  const transaction = mockTransactions.find((t) => t.id === transactionId)

  if (!transaction) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="border-2 border-black bg-white p-12 text-center">
            <h1 className="text-2xl font-bold text-black">Transaction Not Found</h1>
            <p className="mt-4 text-gray-600">The transaction you're looking for doesn't exist.</p>
            <a
              href="/transactions"
              className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              <ArrowLeft size={20} />
              Back to Transactions
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0s" }}>
          <a
            href="/transactions"
            className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-bold text-black transition-all hover:bg-black hover:text-white"
          >
            <ArrowLeft size={20} />
            Back to Transactions
          </a>
        </div>

        {/* Detail Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <TransactionDetailSection transaction={transaction} />
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-8 flex flex-wrap gap-4">
          <button className="border-2 border-black bg-white px-6 py-3 font-bold text-black transition-all hover:bg-black hover:text-white">
            Download Invoice
          </button>
          <button className="border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black">
            Need Help?
          </button>
        </div> */}
        
      </div>

    </main>
  )
}
