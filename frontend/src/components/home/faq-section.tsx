"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "We typically process orders within 24 hours and ship via standard courier. Most orders arrive within 3-5 business days. Express shipping options are also available for urgent orders.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy on all books in original condition. If you're not satisfied with your purchase, simply contact us for a prepaid return label and refund.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes! We ship to over 150 countries worldwide. International shipping rates vary based on location and weight. You'll see the exact cost at checkout.",
    },
    {
      question: "Can I pre-order upcoming books?",
      answer:
        "We offer pre-orders for upcoming releases. You'll be notified as soon as the book is available, and it will be shipped immediately to you.",
    },
    {
      question: "Do you have a loyalty program?",
      answer:
        "Yes, our ShelfRewards program gives you points for every purchase. Accumulate points and redeem them for discounts, free books, and exclusive offers.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "We use industry-leading SSL encryption and partner with trusted payment processors. Your information is completely secure and protected.",
    },
  ]

  return (
    <section className="py-24 border-b border-black/10 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center animate-in fade-in duration-700">
          <div className="inline-block border border-black/20 px-4 py-2 bg-black/5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-widest text-black/70">QUESTIONS?</p>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="group animate-in fade-in duration-700"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full border-2 border-black/20 bg-white p-6 text-left transition-all duration-300 hover:border-black hover:bg-black/2 active:bg-black/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-lg text-black pr-4">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-black flex-shrink-0 transition-transform duration-300 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {openIndex === idx && (
                <div className="border-2 border-t-0 border-black/20 bg-black/2 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-black/70 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
