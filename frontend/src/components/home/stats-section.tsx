"use client"

import { useEffect, useState } from "react"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({ books: 0, readers: 0, reviews: 0, countries: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    const element = document.getElementById("stats-counter")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const targets = { books: 10000, readers: 50000, reviews: 25000, countries: 150 }
    const duration = 2000
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      setCounts({
        books: Math.floor(targets.books * progress),
        readers: Math.floor(targets.readers * progress),
        reviews: Math.floor(targets.reviews * progress),
        countries: Math.floor(targets.countries * progress),
      })

      if (progress === 1) clearInterval(interval)
    }, 50)
  }, [isVisible])

  const stats = [
    { value: `${counts.books}+`, label: "Books Available", color: "bg-black" },
    { value: `${counts.readers}+`, label: "Happy Readers", color: "bg-black" },
    { value: `${counts.reviews}+`, label: "Book Reviews", color: "bg-black" },
    { value: `${counts.countries}+`, label: "Countries Served", color: "bg-black" },
  ]

  return (
    <section id="stats" className="py-24 border-b border-black/10 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="stats-counter" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group animate-in fade-in scale-in duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative overflow-hidden border-2 border-black/20 p-8 bg-black/2 transition-all duration-300 hover:border-black hover:bg-black/5">
                <div className="space-y-3">
                  <p className="text-5xl sm:text-6xl font-black text-black tracking-tight">{stat.value}</p>
                  <p className="text-sm font-semibold text-black/60 tracking-wide">{stat.label}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
