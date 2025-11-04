/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import { useState } from "react"
import { Menu, X, ShoppingCart, Settings, Home, Store, History, LogIn, UserPlus, LogOut } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext"; // Impor useCart

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemCount } = useCart(); // Ambil jumlah item keranjang
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  // console.log("User: ", user); // Log ini sudah benar

  const handleLogout = () => {
    logout();
    navigate('/'); // Gunakan navigate untuk SPA-friendly redirect
  };

  // ===== PERBAIKAN LOGIKA NAVIGASI =====

  // 1. Definisikan item navigasi berdasarkan role
  const guestNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
  ];

  const userNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
    { label: "Transaction History", href: "/transaction", icon: History },
  ];

  const adminNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Admin Dashboard", href: "/admin", icon: Settings },
  ];
  
  // 2. Tentukan item mana yang akan digunakan
  let navItems;
  if (isAdmin) {
    navItems = adminNavItems;
  } else if (isAuthenticated) {
    navItems = userNavItems;
  } else {
    navItems = guestNavItems;
  }
  // ======================================

  const renderNavLinks = (isMobile = false) => (
    navItems.map((item) => (
      <a
        key={item.href}
        href={item.href}
        className={isMobile 
          ? "flex items-center gap-3 text-base font-medium text-black/70 hover:text-black transition-colors px-2 py-3"
          : "text-sm font-medium text-black/70 hover:text-black transition-colors duration-200 relative group"
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        {isMobile && <item.icon size={20} />}
        <span>{item.label}</span>
        {!isMobile && (
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
        )}
      </a>
    ))
  );

  const renderAuthControls = (isMobile = false) => {
    if (isAdmin) {
      // ===== TAMPILAN ADMIN =====
      return (
        <div className={`flex items-center gap-4 ${isMobile ? 'flex-col w-full' : ''}`}>
          <span className="text-gray-700 font-medium hidden md:inline">
            Admin: {user?.firstName}
          </span>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-white hover:text-black transition-all ${isMobile ? 'py-3' : ''}`}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      );
    }

    if (isAuthenticated) {
      // ===== TAMPILAN CUSTOMER =====
      return (
        <div className={`flex items-center gap-4 ${isMobile ? 'flex-col w-full' : ''}`}>
          <button 
            className="relative p-2 text-black hover:text-black/60 transition-colors" 
            onClick={() => {
              navigate("/cart");
              isMobile && setIsOpen(false);
            }}
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <span className="text-gray-700 font-medium hidden md:inline">
            Hi, {user?.firstName}
          </span>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 border-2 border-black bg-transparent text-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-all ${isMobile ? 'py-3' : ''}`}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      );
    }

    // ===== TAMPILAN GUEST =====
    return (
      <div className={`flex items-center gap-3 ${isMobile ? 'flex-col w-full' : ''}`}>
        <a
          href="/login"
          className={`w-full flex items-center justify-center gap-2 text-black/70 hover:text-black px-4 py-2 font-bold transition-all ${isMobile ? 'border-2 border-black py-3' : ''}`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <LogIn size={16} />
          Login
        </a>
        <a
          href="/register"
          className={`w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 font-bold border-2 border-black hover:bg-white hover:text-black transition-all ${isMobile ? 'py-3' : ''}`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <UserPlus size={16} />
          Register
        </a>
      </div>
    );
  };

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
            {renderNavLinks(false)}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {renderAuthControls(false)}
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
            <div className="flex flex-col gap-2">
              {renderNavLinks(true)}
              
              {/* Garis pemisah */}
              <div className="border-t border-black/10 my-2"></div>
              
              {renderAuthControls(true)}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}