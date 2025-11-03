/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import type { Product, CreateProductRequest } from '../../services/api';

interface BookFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductRequest) => void;
  onCancel: () => void;
}

export default function BookForm({ initialData, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>({
    title: '',
    author: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    language: 'English',
    isbn: '',
    publisher: '',
    pages: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        description: initialData.description,
        price: initialData.price,
        stock: initialData.stock,
        category: initialData.category,
        imageUrl: initialData.imageUrl || '',
        language: initialData.language,
        isbn: initialData.isbn || '',
        publisher: initialData.publisher || '',
        pages: initialData.pages,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!(formData.language ?? '').trim()) newErrors.language = 'Language is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CreateProductRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Biography',
    'History',
    'Science',
    'Technology',
    'Business',
    'Self-Help',
    'Children',
    'Young Adult',
    'Poetry',
    'Drama',
    'Horror',
    'Comedy',
    'Travel',
    'Cooking',
    'Art',
    'Music',
    'Sports',
    'Health',
    'Religion',
    'Philosophy',
    'Education',
    'Reference'
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="Enter book title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Author */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Author *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.author ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="Enter author name"
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.description ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="Enter book description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.price ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.stock ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.category ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Language *
          </label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.language ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="English"
          />
          {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            ISBN
          </label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => handleChange('isbn', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="978-0-0000-0000-0"
          />
        </div>

        {/* Publisher */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Publisher
          </label>
          <input
            type="text"
            value={formData.publisher}
            onChange={(e) => handleChange('publisher', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="Publisher name"
          />
        </div>

        {/* Pages */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Number of Pages
          </label>
          <input
            type="number"
            min="1"
            value={formData.pages || ''}
            onChange={(e) => handleChange('pages', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="0"
          />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-6 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold"
        >
          {initialData ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </form>
  );
}