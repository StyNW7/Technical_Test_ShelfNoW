"use client"

import { useState } from "react"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/mock-books"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const inStock = book.stock > 0

  return (
    <a href={`/shop/${book.id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Book Image Container */}
        <div className="relative mb-4 overflow-hidden border-2 border-black bg-white aspect-[3/4]">
          <img
            src={book.imageUrl || "/placeholder.svg"}
            alt={book.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />

          {/* Overlay on Hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
              <Button
                size="sm"
                className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                View Details
              </Button>
            </div>
          )}

          {/* Out of Stock Badge */}
          {!inStock && (
            <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-xs font-bold border border-black">
              OUT OF STOCK
            </div>
          )}

          {/* Stock Indicator Badge */}
          {inStock && book.stock < 5 && (
            <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-xs font-bold border border-black">
              ONLY {book.stock} LEFT
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3 left-3 p-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>

        {/* Book Info */}
        <div className="space-y-2">
          {/* Category */}
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{book.category}</p>

          {/* Title */}
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:underline transition-all">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-700">{book.author}</p>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 pt-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < 4 ? "fill-black text-black" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-xs text-gray-600">(245)</span>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-black">
            <span className="font-bold text-lg">${book.price.toFixed(2)}</span>
            <span className={`text-xs font-bold uppercase ${inStock ? "text-green-700" : "text-red-700"}`}>
              {inStock ? "In Stock" : "Sold Out"}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
