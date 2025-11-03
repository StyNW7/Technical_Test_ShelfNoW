"use client"

import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Book Lover",
      content: "ShelfNoW has completely transformed my reading habit. The curated selections are absolutely perfect.",
      rating: 5,
      image: "👩",
    },
    {
      name: "James Chen",
      role: "Student",
      content: "Fast shipping, excellent quality books, and the customer service is outstanding. Highly recommended!",
      rating: 5,
      image: "👨",
    },
    {
      name: "Emma Rodriguez",
      role: "Entrepreneur",
      content: "The best online bookstore I've found. Amazing selection and the prices are unbeatable.",
      rating: 5,
      image: "👩‍💼",
    },
    {
      name: "Alex Thompson",
      role: "Teacher",
      content: "I use ShelfNoW for all my book purchases now. The website is intuitive and delivery is reliable.",
      rating: 5,
      image: "🧑‍🏫",
    },
  ]

  return (
    <section className="py-24 border-b border-black/10 bg-black/2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center animate-in fade-in duration-700">
          <div className="inline-block border border-black/20 px-4 py-2 bg-white backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-widest text-black/70">TESTIMONIALS</p>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">Loved by Readers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.name}
              className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="h-full border-2 border-black/20 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-lg hover:shadow-black/10">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-black text-black group-hover:scale-110 transition-transform"
                    />
                  ))}
                </div>

                <p className="text-black/70 text-sm leading-relaxed mb-6 font-medium">"{testimonial.content}"</p>

                <div className="flex items-center gap-4 pt-4 border-t border-black/10">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-black/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
