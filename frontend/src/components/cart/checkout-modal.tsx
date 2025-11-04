// components/cart/checkout-modal.tsx
"use client"

import { useState } from "react"
import { X, CreditCard, Building, Loader2 } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  totalAmount: number
  totalItems: number
  onConfirm: (data: {
    paymentMethod: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentDetails: {
      bank?: string;
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
    };
  }) => void
  onCancel: () => void
  loading?: boolean
}

export function CheckoutModal({ 
  isOpen, 
  totalAmount, 
  totalItems, 
  onConfirm, 
  onCancel, 
  loading = false 
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD")
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Indonesia"
  })
  const [paymentDetails, setPaymentDetails] = useState({
    bank: "BCA",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm({
      paymentMethod,
      shippingAddress,
      paymentDetails: paymentMethod === "CREDIT_CARD" ? paymentDetails : { bank: paymentDetails.bank }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="border-b-4 border-black p-6 bg-black text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={24} />
              <h2 className="text-2xl font-bold">Checkout</h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-300 mt-2">
            {totalItems} item{totalItems !== 1 ? 's' : ''} • Total: ${totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wider border-b-2 border-black pb-2">
              Shipping Address
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold uppercase mb-2">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                  placeholder="Enter your street address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase mb-2">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                  placeholder="City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase mb-2">State/Province</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                  placeholder="State"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase mb-2">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                  placeholder="ZIP Code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Country</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wider border-b-2 border-black pb-2">
              Payment Method
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-black hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CREDIT_CARD"
                  checked={paymentMethod === "CREDIT_CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <CreditCard size={20} />
                <span className="font-bold">Credit Card</span>
              </label>
              
              <label className="flex items-center gap-3 p-4 border-2 border-black hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VIRTUAL_ACCOUNT"
                  checked={paymentMethod === "VIRTUAL_ACCOUNT"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <Building size={20} />
                <span className="font-bold">Virtual Account</span>
              </label>
            </div>

            {/* Payment Details */}
            {paymentMethod === "VIRTUAL_ACCOUNT" && (
              <div className="space-y-4 p-4 border-2 border-black bg-gray-50">
                <label className="block text-sm font-bold uppercase mb-2">Bank</label>
                <select
                  value={paymentDetails.bank}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, bank: e.target.value }))}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                >
                  <option value="BCA">BCA</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                  <option value="MANDIRI">Mandiri</option>
                </select>
              </div>
            )}

            {paymentMethod === "CREDIT_CARD" && (
              <div className="space-y-4 p-4 border-2 border-black bg-gray-50">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Card Number</label>
                  <input
                    type="text"
                    required
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-2">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold uppercase mb-2">CVV</label>
                    <input
                      type="text"
                      required
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black/50"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t-2 border-black">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border-2 border-black p-3 font-bold uppercase hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 border-2 border-black bg-black text-white p-3 font-bold uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}