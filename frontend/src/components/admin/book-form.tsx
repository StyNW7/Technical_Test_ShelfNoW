import { useState } from "react"

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  publisher?: string;
  publishedAt?: Date;
  language: string;
  pages?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Children",
  "Young Adult",
  "Romance",
  "Thriller",
  "Horror",
  "Self-Help",
  "Business",
  "Science",
  "Technology",
  "Art",
  "Cooking",
  "Travel",
  "Religion"
];

interface BookFormProps {
  initialData?: Book
  onSubmit: (data: Omit<Book, "id" | "createdAt" | "updatedAt">) => void | Promise<void>
  onCancel: () => void
}

export default function BookForm({ initialData, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    description: initialData?.description || "",
    isbn: initialData?.isbn || "",
    price: initialData?.price?.toString() || "",
    stock: initialData?.stock?.toString() || "0",
    imageUrl: initialData?.imageUrl || "",
    category: initialData?.category || "Fiction",
    publisher: initialData?.publisher || "",
    publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split("T")[0] : "",
    language: initialData?.language || "English",
    pages: initialData?.pages?.toString() || "",
    isActive: initialData?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0"
    if (!formData.stock || Number.parseInt(formData.stock) < 0) newErrors.stock = "Stock cannot be negative"
    if (formData.pages && Number.parseInt(formData.pages) <= 0) newErrors.pages = "Pages must be greater than 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        isbn: formData.isbn || undefined,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        imageUrl: formData.imageUrl || undefined,
        category: formData.category,
        publisher: formData.publisher || undefined,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : undefined,
        language: formData.language,
        pages: formData.pages ? Number.parseInt(formData.pages) : undefined,
        isActive: formData.isActive,
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in p-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
            Title *
          </label>
          <input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Book title"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-gray-900 transition-colors ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <label htmlFor="author" className="block text-sm font-semibold text-gray-900">
            Author *
          </label>
          <input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder="Author name"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-gray-900 transition-colors ${
              errors.author ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.author && <p className="text-xs text-red-500">{errors.author}</p>}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <label htmlFor="isbn" className="block text-sm font-semibold text-gray-900">
            ISBN
          </label>
          <input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => handleChange("isbn", e.target.value)}
            placeholder="ISBN-10 or ISBN-13"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <label htmlFor="publisher" className="block text-sm font-semibold text-gray-900">
            Publisher
          </label>
          <input
            id="publisher"
            value={formData.publisher}
            onChange={(e) => handleChange("publisher", e.target.value)}
            placeholder="Publisher name"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "250ms" }}>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-900">
            Price *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="0.00"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-gray-900 transition-colors ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <label htmlFor="stock" className="block text-sm font-semibold text-gray-900">
            Stock *
          </label>
          <input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            placeholder="0"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-gray-900 transition-colors ${
              errors.stock ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "350ms" }}>
          <label htmlFor="pages" className="block text-sm font-semibold text-gray-900">
            Pages
          </label>
          <input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) => handleChange("pages", e.target.value)}
            placeholder="0"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-gray-900 transition-colors ${
              errors.pages ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.pages && <p className="text-xs text-red-500">{errors.pages}</p>}
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "450ms" }}>
          <label htmlFor="language" className="block text-sm font-semibold text-gray-900">
            Language
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>
      </div>

      {/* Row 5 */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "500ms" }}>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Book description"
          rows={4}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-gray-900 transition-colors ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      {/* Row 6 */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "550ms" }}>
        <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-900">
          Image URL
        </label>
        <input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      {/* Row 7 */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <label htmlFor="publishedAt" className="block text-sm font-semibold text-gray-900">
          Published Date
        </label>
        <input
          id="publishedAt"
          type="date"
          value={formData.publishedAt}
          onChange={(e) => handleChange("publishedAt", e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "650ms" }}>
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="h-4 w-4 rounded border-2 border-gray-300 cursor-pointer accent-gray-900"
        />
        <label htmlFor="isActive" className="text-sm font-semibold text-gray-900 cursor-pointer">
          Active
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6 border-t-2 border-gray-200 animate-slide-up" style={{ animationDelay: "700ms" }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold border-2 border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : initialData ? "Update Book" : "Create Book"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border-2 border-gray-300 bg-transparent rounded-lg hover:bg-gray-100 transition-all font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}