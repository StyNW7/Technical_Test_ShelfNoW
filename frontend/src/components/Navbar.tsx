"use client"

import { useState } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Shop", href: "#shop" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-black border-2 border-black flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-black tracking-tight hidden sm:inline">ShelfNoW</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-black/70 hover:text-black transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button className="relative p-2 text-black hover:text-black/60 transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
            </button>
            <button className="px-6 py-2.5 bg-black text-white border border-black font-medium text-sm transition-all duration-300 hover:bg-white hover:text-black">
              Browse Books
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-black hover:bg-black/5 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-black/10 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-black/70 hover:text-black transition-colors px-2 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button className="w-full mt-2 px-4 py-2.5 bg-black text-white border border-black font-medium text-sm transition-all hover:bg-white hover:text-black">
                Browse Books
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
