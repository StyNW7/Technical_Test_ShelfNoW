/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { AlertCircle, Check, Loader2 } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  totalAmount: number
  totalItems: number
  onConfirm: () => Promise<void> // Ubah tipe agar menerima Promise
  onCancel: () => void
}

export function CheckoutModal({ isOpen, totalAmount, totalItems, onConfirm, onCancel }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null) // State untuk error

  if (!isOpen) return null

  // ===== PERBAIKAN UTAMA DI SINI =====
  const handleConfirm = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // 1. Panggil fungsi onConfirm yang asli (dari page.tsx)
      await onConfirm(); 

      // 2. Jika berhasil, tampilkan status sukses
      setIsProcessing(false)
      setIsComplete(true)

      // 3. Tutup modal dan arahkan (ditangani oleh onConfirm di page.tsx)
      //    Kita hanya perlu menunggu sebelum mereset state modal
      setTimeout(() => {
        // onConfirm() sudah dipanggil, jadi kita hanya perlu mereset modal
        setIsComplete(false)
        // onCancel() akan menutup modal jika onConfirm tidak mengarahkan
      }, 2000) // Tampilkan sukses selama 2 detik

    } catch (err: any) {
      // 4. Jika gagal, tangkap error dan tampilkan
      console.error("Checkout failed in modal:", err)
      setError(err.message || "An unknown error occurred during checkout.")
      setIsProcessing(false)
      setIsComplete(false)
    }
  }
  // ==================================

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white border-4 border-black max-w-md w-full animate-scale-in"
        style={{ animationDelay: "0.1s" }}
      >
        {!isComplete ? (
          <>
            {/* Header */}
            <div className="border-b-4 border-black p-6 bg-black text-white">
              <div className="flex items-center gap-3">
                <AlertCircle size={24} />
                <h2 className="text-2xl font-bold">Confirm Order</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <span className="font-bold uppercase text-gray-700">Total Items</span>
                  <span className="text-2xl font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <span className="font-bold uppercase text-gray-700">Total Amount</span>
                  <span className="text-3xl font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-100 border-2 border-black p-4">
                <p className="text-sm font-bold text-gray-700 text-center">
                  By confirming this order, your items will be processed and your cart will be cleared.
                </p>
              </div>

              {/* Tampilkan Error jika ada */}
              {error && (
                <div className="bg-red-50 border-2 border-red-300 p-3 text-red-700 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="flex-1 border-2 border-black p-3 font-bold uppercase hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className={`flex-1 border-2 border-black p-3 font-bold uppercase transition-colors flex items-center justify-center ${
                    isProcessing
                      ? "bg-gray-500 text-white cursor-not-allowed opacity-75"
                      : "bg-black text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Confirm Order"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="border-b-4 border-black p-6 bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <Check size={24} className="animate-scale-in" />
                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
              </div>
            </div>

            <div className="p-8 text-center space-y-4 animate-slide-up">
              <p className="text-lg font-bold">Your order has been successfully placed.</p>
              <div className="bg-green-50 border-2 border-green-600 p-4">
                <p className="text-sm text-green-700 font-bold">
                  Redirecting you to confirmation...
                </p>
              </div>
              <p className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}