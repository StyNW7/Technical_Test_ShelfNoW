"use client"

import { type Transaction, getOrderStatusColor } from "@/lib/mock-transactions"
import { Calendar, Package, Truck } from "lucide-react"

interface TransactionDetailSectionProps {
  transaction: Transaction
}

export function TransactionDetailSection({ transaction }: TransactionDetailSectionProps) {
  const formattedDate = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <Package className="text-green-700" />
      case "SHIPPED":
        return <Truck className="text-blue-700" />
      default:
        return <Package className="text-gray-700" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-2 border-black bg-white p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-black md:text-3xl">Transaction Details</h1>
            <p className="text-gray-600">Order ID: {transaction.order.id}</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-black">${transaction.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Transaction Info */}
        <div className="border-2 border-black bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-black">Transaction Information</h2>
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm font-bold text-black">{transaction.id}</span>
            </div>
            <div className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Status</span>
              <div className={`border px-3 py-1 text-xs font-bold ${getStatusIcon(transaction.status)}`}>
                {transaction.status}
              </div>
            </div>
            <div className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Payment Method</span>
              <span className="text-sm font-bold text-black">{transaction.paymentMethod}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-gray-600">Transaction Date</span>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-black" />
                <span className="text-sm font-bold text-black">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-2 border-black bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-black">Payment Details</h2>
          <div className="space-y-4">
            {transaction.paymentDetails.cardBrand && (
              <>
                <div className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">Card Brand</span>
                  <span className="text-sm font-bold text-black">{transaction.paymentDetails.cardBrand}</span>
                </div>
                <div className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">Card Last 4</span>
                  <span className="font-mono text-sm font-bold text-black">
                    •••• {transaction.paymentDetails.cardLast4}
                  </span>
                </div>
              </>
            )}
            {transaction.paymentDetails.email && (
              <div className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
                <span className="text-sm font-semibold text-gray-600">Email</span>
                <span className="text-sm font-bold text-black">{transaction.paymentDetails.email}</span>
              </div>
            )}
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-gray-600">Amount Paid</span>
              <span className="text-lg font-bold text-black">${transaction.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="border-2 border-black bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-black">Order Status</h2>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-2">Current Status</p>
            <div
              className={`inline-block border px-4 py-2 text-sm font-bold ${getOrderStatusColor(transaction.order.status)}`}
            >
              {transaction.order.status}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-600 mb-2">Items in Order</p>
            <p className="text-2xl font-bold text-black">{transaction.order.items.length}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border-2 border-black bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-black">Order Items</h2>
        <div className="space-y-3">
          {transaction.order.items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-start justify-between pb-3 ${index !== transaction.order.items.length - 1 ? "border-b-2 border-gray-200" : ""}`}
            >
              <div className="flex-1">
                <p className="font-bold text-black">{item.title}</p>
                <p className="text-sm text-gray-600">{item.author}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 space-y-2 border-t-2 border-black pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold text-black">${transaction.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-bold text-black">${(transaction.amount * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t-2 border-gray-200">
            <span className="font-bold text-black">Total</span>
            <span className="text-lg font-bold text-black">${(transaction.amount * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
