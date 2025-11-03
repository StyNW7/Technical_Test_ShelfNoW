/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { mockBooks } from "@/lib/mock-books"
import { Heart, Star, ShoppingCart, User, Package, ChevronLeft, Check } from "lucide-react"
import { useParams } from "react-router-dom"

export default function BookDetailPage() {
    
  const params = useParams()
  const bookId = params.id as string
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAddedNotification, setShowAddedNotification] = useState(false)
  const [cartItem, setCartItem] = useState<{ id: string; quantity: number } | null>(null)

  const book = mockBooks.find((b) => b.id === bookId)

  if (!book) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
            <a href="/shop">
              <Button className="border-2 border-black">
                <ChevronLeft size={20} />
                Back to Shop
              </Button>
            </a>
          </div>
        </div>
      </main>
    )
  }

  const inStock = book.stock > 0
  const maxQuantity = Math.min(quantity + 9, book.stock)

  const handleAddToCart = () => {
    setCartItem({ id: book.id, quantity })
    setShowAddedNotification(true)
    setTimeout(() => setShowAddedNotification(false), 3000)
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <a href="/shop" className="text-sm hover:font-bold transition-all">
            ← Back to Shop
          </a>
        </div>
      </div>

      {/* Book Detail */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="animate-fade-in">
            <div className="border-2 border-black overflow-hidden bg-gray-50 aspect-[3/4] flex items-center justify-center">
              <img src={book.imageUrl || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover" />
            </div>

            {/* Additional Info Below Image */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border-2 border-black p-4 bg-white">
                <p className="text-xs font-bold uppercase text-gray-600 mb-2">Pages</p>
                <p className="text-2xl font-bold">{book.pages || "N/A"}</p>
              </div>
              <div className="border-2 border-black p-4 bg-white">
                <p className="text-xs font-bold uppercase text-gray-600 mb-2">Language</p>
                <p className="text-lg font-bold">{book.language}</p>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-8 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            {/* Title & Author */}
            <div className="space-y-2 border-b-2 border-black pb-6">
              <p className="text-xs font-bold uppercase text-gray-600 tracking-wider">{book.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{book.title}</h1>
              <p className="text-xl text-gray-700 flex items-center gap-2">
                <User size={18} />
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < 4 ? "fill-black text-black" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(245 reviews)</span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="space-y-4 border-b-2 border-black pb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold">${book.price.toFixed(2)}</span>
                {!inStock && <span className="text-lg font-bold text-red-600 line-through">Out of Stock</span>}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <Package size={18} />
                <span className={`font-bold text-lg ${inStock ? "text-green-700" : "text-red-700"}`}>
                  {inStock
                    ? `${book.stock} in stock${book.stock < 5 ? " - Limited availability" : ""}`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 border-b-2 border-black pb-6">
              <h3 className="font-bold text-lg uppercase tracking-wider">Description</h3>
              <p className="text-gray-700 leading-relaxed text-base">{book.description}</p>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-6">
              {book.isbn && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-gray-600">ISBN</p>
                  <p className="font-mono text-sm">{book.isbn}</p>
                </div>
              )}
              {book.publisher && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-gray-600">Publisher</p>
                  <p className="font-bold text-sm">{book.publisher}</p>
                </div>
              )}
              {book.publishedAt && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-gray-600">Published</p>
                  <p className="font-bold text-sm">
                    {new Date(book.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {inStock && (
                <div className="flex items-center gap-4 border-2 border-black p-4 bg-white">
                  <span className="font-bold uppercase text-sm">Quantity:</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.min(Math.max(1, Number(e.target.value)), book.stock)
                      setQuantity(val)
                    }}
                    className="w-16 text-center border-2 border-black font-bold text-lg focus:outline-none focus:ring-2 focus:ring-black/50"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 h-14 border-2 border-black font-bold text-base uppercase tracking-wider ${
                    inStock ? "bg-black text-white hover:bg-white hover:text-black" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </Button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="w-14 h-14 border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                >
                  <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>
            </div>

            {/* Added to Cart Notification */}
            {showAddedNotification && (
              <div className="animate-slide-in-bottom fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 border-2 border-black rounded-none flex items-center gap-3 shadow-lg z-50">
                <Check size={20} />
                <span className="font-bold">Added {quantity} to cart!</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Books CTA */}
      <section className="border-t-2 border-black bg-black text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Continue Shopping</h2>
          <p className="text-gray-300 mb-8 text-lg">Discover more books in our collection</p>
          <a href="/shop">
            <Button className="bg-white text-black border-2 border-white hover:bg-black hover:text-white hover:border-white">
              View All Books
            </Button>
          </a>
        </div>
      </section>

    </main>
  )
}
