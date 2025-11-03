/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Package, Zap, Menu, X, Home } from 'lucide-react';

// Mock data
const mockBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    price: 15.99,
    stock: 25,
    category: 'Fiction',
    isActive: true,
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    price: 18.99,
    stock: 8,
    category: 'Fiction',
    isActive: true,
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    price: 16.99,
    stock: 0,
    category: 'Fiction',
    isActive: false,
  },
];

export default function AdminPage() {
  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [books, searchTerm]
  );

  const handleCreate = (newBook: any) => {
    const book = {
      ...newBook,
      id: Date.now().toString(),
    };
    setBooks((prev) => [book, ...prev]);
    setIsCreateOpen(false);
  };

  const handleUpdate = (updatedBook: { id: string; }) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    setIsEditOpen(false);
    setSelectedBook(null);
  };

  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
      setIsDeleteOpen(false);
      setBookToDelete(null);
    }
  };

  const stats = [
    {
      label: 'Total Books',
      value: books.length,
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      label: 'Active Books',
      value: books.filter((b) => b.isActive).length,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      label: 'Total Stock',
      value: books.reduce((sum, b) => sum + b.stock, 0),
      icon: <Package className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from { 
            transform: translateX(-100%);
          }
          to { 
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ShelfNoW Admin</h1>
                <p className="text-xs text-gray-600">Book Management Dashboard</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-[73px] left-0 w-60 bg-white border-r-2 border-gray-200 h-[calc(100vh-73px)] transition-transform duration-300 z-30 animate-slide-in-right`}
        >
          <nav className="p-4 space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium"
            >
              <Package className="w-5 h-5" />
              Overview
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Shop
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">{stat.label}</span>
                  <div className="bg-gray-900 text-white p-2.5 rounded-lg">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Books Management Card */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden animate-fade-in">
            {/* Card Header */}
            <div className="border-b-2 border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Book Inventory</h2>
                  <p className="text-gray-600 mt-1">Manage all books in your catalog</p>
                </div>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add New Book
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6 relative animate-slide-up">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                />
              </div>

              {/* Books Table */}
              <div className="overflow-x-auto border-2 border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Author</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book, idx) => (
                        <tr
                          key={book.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <td className="px-4 py-4 font-medium text-gray-900 max-w-xs truncate">
                            {book.title}
                          </td>
                          <td className="px-4 py-4 text-gray-700">{book.author}</td>
                          <td className="px-4 py-4 text-right font-semibold text-gray-900">
                            ${book.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                book.stock > 10
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : book.stock > 0
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {book.stock}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700">{book.category}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                book.isActive
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                              }`}
                            >
                              {book.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedBook(book);
                                  setIsEditOpen(true);
                                }}
                                className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-700" />
                              </button>
                              <button
                                onClick={() => {
                                  setBookToDelete(book);
                                  setIsDeleteOpen(true);
                                }}
                                className="p-2 border-2 border-red-300 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                          No books found. Try adjusting your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredBooks.length} of {books.length} books
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create/Edit Book Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="border-b-2 border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isCreateOpen ? 'Create New Book' : 'Edit Book'}
              </h3>
              <p className="text-gray-600 mt-1">
                {isCreateOpen ? 'Add a new book to your inventory' : 'Update book information'}
              </p>
            </div>
            <BookForm
              initialData={selectedBook}
              onSubmit={isCreateOpen ? handleCreate : handleUpdate}
              onCancel={() => {
                setIsCreateOpen(false);
                setIsEditOpen(false);
                setSelectedBook(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && bookToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 max-w-md w-full animate-fade-in">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete {bookToDelete.title}?
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. The book will be permanently removed from your inventory.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setBookToDelete(null);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white border-2 border-red-600 rounded-lg hover:bg-red-700 transition-all font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Book Form Component
function BookForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      author: '',
      isbn: '',
      price: '',
      stock: '',
      category: 'Fiction',
      isActive: true,
    }
  );

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    });
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book title"
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="978-0-00-000000-0"
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
            >
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Mystery</option>
              <option>Science Fiction</option>
              <option>Biography</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="19.99"
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="100"
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-2 border-gray-300 cursor-pointer accent-gray-900"
            />
            <span className="text-sm font-semibold text-gray-900">Book is active</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-6 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold shadow-lg"
        >
          {initialData ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </div>
  );
}