"use client"

import { Search, ShoppingCart, Truck, BookMarked } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Discover",
      description: "Explore our vast collection of books across all genres and find your next favorite read.",
    },
    {
      icon: ShoppingCart,
      title: "Add to Cart",
      description: "Build your collection with just a few clicks. Create wishlists and save for later.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "We ship quickly and securely to your doorstep within 3-5 business days.",
    },
    {
      icon: BookMarked,
      title: "Enjoy Reading",
      description: "Join our community, share reviews, and discover new books based on your interests.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 border-b border-black/10 bg-black/2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center animate-in fade-in duration-700">
          <div className="inline-block border border-black/20 px-4 py-2 bg-white backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-widest text-black/70">SIMPLE PROCESS</p>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">How It Works</h2>
          <p className="text-xl text-black/60 max-w-2xl mx-auto">Get started in four simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative border-2 border-black bg-white p-8 h-full transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-black border-2 border-white flex items-center justify-center">
                    <span className="text-white font-black">{idx + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="pt-8 space-y-4">
                    <Icon size={32} className="text-black group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg tracking-tight">{step.title}</h3>
                    <p className="text-black/60 text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-0.5 bg-black/20 transform -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
