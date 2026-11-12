import React from 'react';
import { UtensilsCrossed, Phone, Mail, MapPin, Heart, Code2 } from 'lucide-react';

interface FooterProps {
  onOpenJavaGuide: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenJavaGuide,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-xs">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Foodie<span className="text-orange-500">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Crafting unforgettable culinary memories. Freshly hand-tossed pizzas, juicy artisan smash burgers, royal dum biryani, and golden crispy sides delivered hot to your doorstep.
            </p>
            <div className="pt-1 text-xs text-stone-500">
              Open Daily: <span className="text-stone-300 font-medium">10:00 AM – 11:30 PM</span>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Cravings
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('pizza')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Wood-Fired Pizza
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('burger')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Gourmet Smash Burgers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('biriyani')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Royal Dum Biryani
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sandwich')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Artisan Club Sandwiches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fries')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Crispy French Fries
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Our Promise
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>✓ 30-45 Minute Express Drop</li>
              <li>✓ 100% Contactless Delivery</li>
              <li>✓ Real Ingredients, No Artificial Preservatives</li>
              <li>✓ Eco-Friendly Insulated Packaging</li>
              <li>
                <button
                  onClick={onOpenJavaGuide}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 underline font-medium cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>View Java JSP/Servlet Architecture</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 420-FOOD (3663)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>orders@foodie-fresh.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>100 Gourmet Way, Suite 400, Food City</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Foodie Restaurant & Delivery Co. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Made with passion for good food</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
