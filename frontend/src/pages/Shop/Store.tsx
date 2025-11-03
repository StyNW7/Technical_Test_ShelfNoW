"use client"

import { useState, useMemo, useEffect } from "react"
import { BookCard } from "@/components/shop/book-card"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { productApiService, type Product } from "@/services/product-api"

const ITEMS_PER_PAGE = 12

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [books, setBooks] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalBooks, setTotalBooks] = useState(0)

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await productApiService.getProducts(
          currentPage,
          ITEMS_PER_PAGE,
          selectedCategory === "All" ? undefined : selectedCategory,
          searchQuery || undefined
        )
        setBooks(response.products)
        setTotalBooks(response.pagination.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books')
        console.error('Error fetching books:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const categoriesList = await productApiService.getCategories()
        setCategories(categoriesList)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchBooks()
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [currentPage, selectedCategory, searchQuery])

  // Filter books by price range (client-side since backend doesn't support price filtering yet)
  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]
      return matchesPrice
    })

    // Sort (client-side since backend doesn't support sorting yet)
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "featured":
      default:
        // Keep original order from backend
        break
    }

    return filtered
  }, [books, priceRange, sortBy])

  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b-2 border-black py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
            <p className="text-gray-700 text-lg">
              Discover exceptional books across all genres. From timeless classics to contemporary bestsellers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <aside className="animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
            />
          </aside>

          {/* Books Grid */}
          <div className="md:col-span-3 space-y-8">
            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b-2 border-black pb-6 animate-fade-in">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  placeholder="Search books, authors..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 border-2 border-black focus:ring-2 focus:ring-black/50 text-base"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 border-2 border-black focus:ring-2 focus:ring-black/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4 text-red-700 animate-fade-in">
                <p className="font-bold">Error loading books</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Results Info */}
            <div className="text-sm text-gray-600 font-mono">
              {isLoading ? (
                "Loading books..."
              ) : (
                <>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalBooks)} of {totalBooks} results
                </>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
                <span className="ml-2 text-lg">Loading books...</span>
              </div>
            )}

            {/* Books Grid */}
            {!isLoading && filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBooks.map((book, index) => (
                  <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300">
                  <p className="text-lg font-bold text-gray-700">No books found</p>
                  <p className="text-gray-600 mt-2">Try adjusting your filters or search query</p>
                </div>
              )
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 border-t-2 border-black pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border-2 border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 border-2 border-black font-bold transition-colors ${
                        currentPage === i + 1 ? "bg-black text-white" : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border-2 border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}