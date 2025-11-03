import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-black border-2 border-black flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-black tracking-tight">ShelfNoW</span>
            </div>
            <p className="text-sm text-black/60 leading-relaxed">
              Discover your next favorite book with our carefully curated collection of timeless classics and
              contemporary bestsellers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">QUICK LINKS</h3>
            <ul className="space-y-3">
              {["Home", "Shop", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-black/60 hover:text-black transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">CUSTOMER SERVICE</h3>
            <ul className="space-y-3">
              {["Shipping Info", "Returns", "FAQ", "Track Order"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-black/60 hover:text-black transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">CONTACT US</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-black/60 mt-1 flex-shrink-0" />
                <a
                  href="mailto:hello@shelfnow.com"
                  className="text-sm text-black/60 hover:text-black transition-colors"
                >
                  hello@shelfnow.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-black/60 mt-1 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-sm text-black/60 hover:text-black transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-black/60 mt-1 flex-shrink-0" />
                <span className="text-sm text-black/60">123 Book Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-black/50 mb-4 md:mb-0">© 2025 ShelfNoW. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Twitter, label: "Twitter" },
              { icon: Instagram, label: "Instagram" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="text-black/60 hover:text-black transition-colors hover:scale-110 transform duration-300"
              >
                <Icon size={20} />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
