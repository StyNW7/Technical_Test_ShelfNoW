"use client"

import { useState, useEffect } from "react"
import { CartItemCard } from "@/components/cart/cart-item-card"
import { CheckoutModal } from "@/components/cart/checkout-modal"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { ShoppingCart, ArrowLeft, Package, Loader2, LogIn } from "lucide-react"
import { useNavigate } from "react-router"

export default function CartPage() {
  const { cart, loading, clearCart, refreshCart, items, totalPrice, totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    refreshCart()
  }, [])

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart')
      return
    }
    setShowCheckoutModal(true)
  }

  const handleConfirmCheckout = async () => {
    try {
      await clearCart()
      setShowCheckoutModal(false)
      navigate('/order-confirmation')
    } catch (error) {
      console.error('Error during checkout:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-lg">Loading cart...</p>
        </div>
      </main>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <section className="border-b-2 border-black py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart size={32} />
              <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
            </div>
            <p className="text-gray-700">Please login to view your cart</p>
          </div>
        </section>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <LogIn size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your shopping cart and add items.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login?redirect=/cart')}
                className="w-full border-2 border-black bg-black text-white p-4 font-bold uppercase hover:bg-white hover:text-black transition-colors"
              >
                Login to Continue
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="w-full border-2 border-black p-3 font-bold uppercase hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const isEmpty = !cart || items.length === 0
  const taxAmount = totalPrice * 0.1
  const finalTotal = totalPrice * 1.1

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
              : `You have ${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
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
              <button 
                onClick={() => navigate('/shop')}
                className="border-2 border-black px-8 py-3 font-bold uppercase hover:bg-black hover:text-white transition-colors"
              >
                <ArrowLeft size={18} className="inline mr-2" />
                Continue Shopping
              </button>
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
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax (estimated)</span>
                  <span className="font-bold">$0.00</span>
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
              {items.map((item, index) => (
                <div key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
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
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
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
              <button 
                onClick={() => navigate('/shop')}
                className="w-full border-2 border-black p-3 font-bold uppercase hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>

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
        totalItems={totalItems}
        onConfirm={handleConfirmCheckout}
        onCancel={() => setShowCheckoutModal(false)}
      />
    </main>
  )
}