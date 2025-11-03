"use client"

import type React from "react"

import { useState } from "react"
import type { Book } from "@/lib/mock-books"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { categories } from "@/lib/mock-books"

interface BookFormProps {
  initialData?: Book
  onSubmit: (data: Omit<Book, "id" | "createdAt" | "updatedAt">) => void
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <Label htmlFor="title" className="font-semibold">
            Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Book title"
            className={`border-2 focus:ring-2 ${errors.title ? "border-destructive" : "border-black"}`}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Label htmlFor="author" className="font-semibold">
            Author *
          </Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder="Author name"
            className={`border-2 focus:ring-2 ${errors.author ? "border-destructive" : "border-black"}`}
          />
          {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <Label htmlFor="isbn" className="font-semibold">
            ISBN
          </Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => handleChange("isbn", e.target.value)}
            placeholder="ISBN-10 or ISBN-13"
            className="border-2 border-black focus:ring-2"
          />
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Label htmlFor="publisher" className="font-semibold">
            Publisher
          </Label>
          <Input
            id="publisher"
            value={formData.publisher}
            onChange={(e) => handleChange("publisher", e.target.value)}
            placeholder="Publisher name"
            className="border-2 border-black focus:ring-2"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "250ms" }}>
          <Label htmlFor="price" className="font-semibold">
            Price *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="0.00"
            className={`border-2 focus:ring-2 ${errors.price ? "border-destructive" : "border-black"}`}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Label htmlFor="stock" className="font-semibold">
            Stock *
          </Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            placeholder="0"
            className={`border-2 focus:ring-2 ${errors.stock ? "border-destructive" : "border-black"}`}
          />
          {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "350ms" }}>
          <Label htmlFor="pages" className="font-semibold">
            Pages
          </Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) => handleChange("pages", e.target.value)}
            placeholder="0"
            className={`border-2 focus:ring-2 ${errors.pages ? "border-destructive" : "border-black"}`}
          />
          {errors.pages && <p className="text-xs text-destructive">{errors.pages}</p>}
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <Label htmlFor="category" className="font-semibold">
            Category
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className="border-2 border-black focus:ring-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-black">
              {categories.slice(1).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "450ms" }}>
          <Label htmlFor="language" className="font-semibold">
            Language
          </Label>
          <Select value={formData.language} onValueChange={(value) => handleChange("language", value)}>
            <SelectTrigger className="border-2 border-black focus:ring-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-black">
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 5 */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "500ms" }}>
        <Label htmlFor="description" className="font-semibold">
          Description *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Book description"
          rows={4}
          className={`border-2 focus:ring-2 ${errors.description ? "border-destructive" : "border-black"}`}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      {/* Row 6 */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "550ms" }}>
        <Label htmlFor="imageUrl" className="font-semibold">
          Image URL
        </Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="border-2 border-black focus:ring-2"
        />
      </div>

      {/* Row 7 */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <Label htmlFor="publishedAt" className="font-semibold">
          Published Date
        </Label>
        <Input
          id="publishedAt"
          type="date"
          value={formData.publishedAt}
          onChange={(e) => handleChange("publishedAt", e.target.value)}
          className="border-2 border-black focus:ring-2"
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "650ms" }}>
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleChange("isActive", checked as boolean)}
          className="border-2 border-black"
        />
        <Label htmlFor="isActive" className="font-semibold cursor-pointer">
          Active
        </Label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6 border-t-2 border-black animate-slide-up" style={{ animationDelay: "700ms" }}>
        <Button type="submit" className="flex-1 bg-black hover:bg-black/90 text-white border-2 border-black">
          {initialData ? "Update Book" : "Create Book"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-2 border-black bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
