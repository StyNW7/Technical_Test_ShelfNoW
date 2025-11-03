"use client"

interface FilterSidebarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

export function FilterSidebar({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  priceRange, 
  onPriceChange 
}: FilterSidebarProps) {
  return (
    <div className="space-y-8 border-2 border-black p-6 bg-white">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg uppercase tracking-wider border-b-2 border-black pb-2">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("All")}
            className={`block w-full text-left p-2 transition-colors ${
              selectedCategory === "All" ? "bg-black text-white font-bold" : "hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-left p-2 transition-colors ${
                selectedCategory === category ? "bg-black text-white font-bold" : "hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4 border-t-2 border-black pt-6">
        <h3 className="font-bold text-lg uppercase tracking-wider">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-600">Min Price</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/50"
              min="0"
              max="1000"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600">Max Price</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/50"
              min="0"
              max="1000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}