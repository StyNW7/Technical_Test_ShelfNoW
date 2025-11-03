"use client"

import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-32 border-b border-black/10 bg-black text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-8 text-center animate-in fade-in duration-700">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Ready to Start
            <br />
            Your Reading
            <br />
            Journey?
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join thousands of book lovers exploring new worlds through literature. Your next favorite book is waiting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="group inline-flex items-center justify-center px-8 py-4 bg-white text-black border-2 border-white font-semibold transition-all duration-300 hover:bg-black hover:text-white">
              Browse Our Collection
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white font-semibold transition-all duration-300 hover:bg-white hover:text-black">
              Learn More
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-12 border-t border-white/20">
            {["📦 Free shipping on orders over $50", "✨ Carefully curated selections", "💳 Secure checkout"].map(
              (feature) => (
                <div key={feature} className="text-sm text-white/60 flex items-center gap-2">
                  {feature}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
