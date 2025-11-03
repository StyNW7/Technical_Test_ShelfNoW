"use client"

import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center border-b border-black/10 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-4">
              <div className="inline-block border border-black/20 px-4 py-2 bg-black/5 backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-widest text-black/70">WELCOME TO SHELFNOW</p>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                Discover Your
                <br />
                <span className="relative">
                  Next Great
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-black/20 skew-x-12"></span>
                </span>
                <br />
                Read
              </h1>
              <p className="text-xl text-black/60 leading-relaxed max-w-md">
                Explore thousands of books from every genre. Find timeless classics, contemporary bestsellers, and
                hidden gems all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group inline-flex items-center justify-center px-8 py-4 bg-black text-white border-2 border-black font-semibold transition-all duration-300 hover:bg-white hover:text-black">
                Start Browsing
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-black border-2 border-black font-semibold transition-all duration-300 hover:bg-black hover:text-white">
                View Bestsellers
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-black/10">
              {[
                { number: "10K+", label: "Books" },
                { number: "50K+", label: "Happy Readers" },
                { number: "98%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-black text-black">{stat.number}</p>
                  <p className="text-sm text-black/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative h-full min-h-96 lg:min-h-full animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
            <div className="relative h-full flex items-center justify-center">
              {/* Books Stack */}
              <div className="relative w-64 h-80 perspective">
                {[
                  { color: "bg-black/90", rotation: "-rotate-6", zIndex: "z-10" },
                  { color: "bg-black/70", rotation: "-rotate-3", zIndex: "z-20" },
                  { color: "bg-black/50", rotation: "rotate-0", zIndex: "z-30" },
                ].map((book, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 ${book.color} ${book.rotation} ${book.zIndex} transform transition-all duration-500 hover:rotate-0 hover:scale-105 cursor-pointer border border-black/20`}
                    style={{
                      transformStyle: "preserve-3d",
                      animation: `float 3s ease-in-out infinite`,
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-black text-white mb-2">📚</div>
                        <p className="text-white/80 text-xs font-semibold">BOOK {idx + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
