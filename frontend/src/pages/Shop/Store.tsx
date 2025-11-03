"use client"

import { useState, useMemo, type SetStateAction } from "react"
import { BookCard } from "@/components/shop/book-card"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockBooks } from "@/lib/mock-books"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 12

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    const filtered = mockBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || book.category === selectedCategory

      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
        break
      case "featured":
      default:
        // Keep original order
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat)
                setCurrentPage(1)
              }}
              priceRange={priceRange}
              onPriceChange={(range) => {
                setPriceRange(range)
                setCurrentPage(1)
              }}
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 border-2 border-black focus:ring-2 focus:ring-black/50 text-base"
                />
              </div>

              <Select value={sortBy} onValueChange={(val: SetStateAction<string>) => setSortBy(val)}>
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

            {/* Results Info */}
            <div className="text-sm text-gray-600 font-mono">
              Showing {paginatedBooks.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredBooks.length)} of {filteredBooks.length} results
            </div>

            {/* Books Grid */}
            {paginatedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedBooks.map((book, index) => (
                  <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-300">
                <p className="text-lg font-bold text-gray-700">No books found</p>
                <p className="text-gray-600 mt-2">Try adjusting your filters or search query</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
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
