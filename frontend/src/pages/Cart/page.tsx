"use client"

import { useState } from "react"
import { CartItemCard } from "@/components/cart/cart-item-card"
import { CheckoutModal } from "@/components/cart/checkout-modal"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, ArrowLeft, Package } from "lucide-react"

export default function CartPage() {
  const { state, clearCart } = useCart()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const handleCheckout = () => {
    setShowCheckoutModal(true)
  }

  const handleConfirmCheckout = () => {
    setShowCheckoutModal(false)
    clearCart()
  }

  const isEmpty = state.items.length === 0
  const taxAmount = state.totalPrice * 0.1
  const finalTotal = state.totalPrice * 1.1

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Page Header */}
      <section className="border-b-2 border-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <ShoppingCart size={32} />
            <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-gray-700">
            {isEmpty
              ? "Your cart is empty"
              : `You have ${state.totalItems} item${state.totalItems !== 1 ? "s" : ""} in your cart`}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-12 md:py-16">
        {isEmpty ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Empty State */}
            <div className="md:col-span-2 border-2 border-dashed border-gray-300 p-12 md:p-16 text-center rounded-none animate-fade-in">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 text-lg">Explore our collection of books and add some to your cart.</p>
              <a href="/shop">
                <button className="border-2 border-black px-8 py-3 font-bold uppercase hover:bg-black hover:text-white transition-colors">
                  <ArrowLeft size={18} className="inline mr-2" />
                  Continue Shopping
                </button>
              </a>
            </div>

            {/* Empty Summary */}
            <div
              className="border-2 border-black p-6 bg-white h-fit animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6 border-b-2 border-black pb-3">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-bold">Free</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-3">
                  <span className="font-bold uppercase">Total</span>
                  <span className="text-2xl font-bold">$0.00</span>
                </div>
              </div>
              <button
                disabled
                className="w-full border-2 border-black bg-gray-100 text-gray-500 p-4 font-bold uppercase cursor-not-allowed opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {state.items.map((item, index) => (
                <div key={item.bookId} style={{ animationDelay: `${index * 0.1}s` }}>
                  <CartItemCard item={item} />
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              className="border-2 border-black p-6 bg-white h-fit sticky top-32 animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6 border-b-2 border-black pb-3">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-bold">${state.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-bold text-green-700">Free</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Tax (estimated)</span>
                  <span className="font-bold">${taxAmount.toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-black pt-4 flex justify-between">
                  <span className="font-bold uppercase">Total</span>
                  <span className="text-2xl font-bold">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full border-2 border-black bg-black text-white p-4 font-bold uppercase hover:bg-white hover:text-black transition-colors mb-3"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <a href="/shop">
                <button className="w-full border-2 border-black p-3 font-bold uppercase hover:bg-gray-100 transition-colors">
                  Continue Shopping
                </button>
              </a>

              {/* Info Box */}
              <div className="mt-6 border-2 border-black p-4 bg-gray-50">
                <p className="text-xs font-bold uppercase text-gray-700 mb-2">✓ Free Shipping</p>
                <p className="text-xs font-bold uppercase text-gray-700 mb-2">✓ 30-Day Returns</p>
                <p className="text-xs font-bold uppercase text-gray-700">✓ Secure Checkout</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        totalAmount={finalTotal}
        totalItems={state.totalItems}
        onConfirm={handleConfirmCheckout}
        onCancel={() => setShowCheckoutModal(false)}
      />

    </main>
  )
}
