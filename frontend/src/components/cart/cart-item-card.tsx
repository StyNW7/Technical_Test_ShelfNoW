"use client"

import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

interface CartItemCardProps {
  item: {
    id: string;
    productId: string;
    bookTitle: string;
    bookAuthor: string;
    bookImage?: string;
    price: number;
    quantity: number;
    stock: number;
  }
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeFromCart, updateCartItem } = useCart()

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      try {
        await updateCartItem(item.id, newQuantity)
      } catch (error) {
        console.error('Error updating quantity:', error)
      }
    }
  }

  return (
    <div className="border-2 border-black p-6 bg-white hover:shadow-lg transition-shadow animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Book Image */}
        <div className="md:col-span-1">
          <div className="border-2 border-black overflow-hidden bg-gray-50 aspect-[3/4]">
            <img
              src={item.bookImage || "/placeholder-book.jpg"}
              alt={item.bookTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-book.jpg";
              }}
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Book</p>
            <h3 className="text-xl font-bold">{item.bookTitle}</h3>
            <p className="text-gray-700">{item.bookAuthor}</p>
          </div>

          <div className="flex items-center gap-4 pt-3">
            <div>
              <p className="text-xs font-bold uppercase text-gray-600 mb-1">Price</p>
              <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-600 mb-1">Available</p>
              <p className={`text-lg font-bold ${item.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                {item.stock} in stock
              </p>
            </div>
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="md:col-span-1 space-y-4">
          {/* Quantity Selector */}
          <div className="border-2 border-black p-3 bg-white flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 border border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              min="1"
              max={item.stock}
              className="flex-1 text-center border-l border-r border-black font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 border border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="border-2 border-black p-3 bg-black text-white text-center">
            <p className="text-xs font-bold uppercase mb-1">Subtotal</p>
            <p className="text-2xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white p-3 font-bold uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}