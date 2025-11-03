/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Star, ShoppingCart, User, Package, ChevronLeft, Check, Loader2 } from "lucide-react"
import { useParams, Link } from "react-router-dom"
import { productApiService, type Product } from "@/services/product-api"

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAddedNotification, setShowAddedNotification] = useState(false)
  const [book, setBook] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch book details from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const bookData = await productApiService.getProduct(bookId)
        setBook(bookData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book details')
        console.error('Error fetching book:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (bookId) {
      fetchBook()
    }
  }, [bookId])

  const inStock = book ? book.stock > 0 : false
  const maxQuantity = book ? Math.min(quantity + 9, book.stock) : 1

  const handleAddToCart = () => {
    setShowAddedNotification(true)
    setTimeout(() => setShowAddedNotification(false), 3000)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
            <p className="text-lg">Loading book details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !book) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The book you're looking for doesn't exist."}</p>
            <Link to="/shop">
              <Button className="border-2 border-black">
                <ChevronLeft size={20} />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Link to="/shop" className="text-sm hover:font-bold transition-all inline-flex items-center gap-1">
            <ChevronLeft size={16} />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Book Detail */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="animate-fade-in">
            <div className="border-2 border-black overflow-hidden bg-gray-50 aspect-[3/4] flex items-center justify-center">
              {book.imageUrl ? (
                <img 
                  src={book.imageUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-book.jpg";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center text-gray-400">
                  <Package size={64} />
                </div>
              )}
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
          <Link to="/shop">
            <Button className="bg-white text-black border-2 border-white hover:bg-black hover:text-white hover:border-white">
              View All Books
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}