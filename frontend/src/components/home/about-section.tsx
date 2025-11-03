"use client"

import { BookOpen, Users, Sparkles, Globe } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-24 border-b border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center animate-in fade-in duration-700">
          <div className="inline-block border border-black/20 px-4 py-2 bg-black/5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-widest text-black/70">OUR STORY</p>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">About ShelfNoW</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <p className="text-xl text-black/70 leading-relaxed">
              Founded in 2020, ShelfNoW was born from a simple idea: make quality literature accessible to everyone. We
              believe that every reader deserves a curated selection of books that inspire, educate, and entertain.
            </p>
            <p className="text-lg text-black/60 leading-relaxed">
              Our mission is to connect readers with their next favorite book. Whether you're a lifelong bibliophile or
              just discovering the joy of reading, we have something special for you.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { number: "4 Years", label: "In Business" },
                { number: "50K+", label: "Active Readers" },
                { number: "10K+", label: "Available Books" },
                { number: "24/7", label: "Customer Support" },
              ].map((stat) => (
                <div key={stat.label} className="border border-black/10 p-4 bg-black/2">
                  <p className="text-2xl font-black text-black">{stat.number}</p>
                  <p className="text-xs text-black/60 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            {[
              {
                icon: BookOpen,
                title: "Curated Selection",
                desc: "Handpicked books from renowned authors and emerging voices",
              },
              { icon: Users, title: "Community", desc: "Connect with fellow readers and book lovers" },
              { icon: Sparkles, title: "Quality", desc: "Premium editions and carefully sourced collections" },
              { icon: Globe, title: "Global Reach", desc: "Shipping to 150+ countries worldwide" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="border border-black/10 p-6 bg-black/2 hover:bg-black/5 transition-colors duration-300 group cursor-pointer"
                >
                  <Icon size={28} className="text-black mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-black/60 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
