import React from 'react';
import { HERO_IMAGE } from '../data/foodItems';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onSelectCategory,
  selectedCategory,
}) => {
  const quickFavorites = [
    { id: 'pizza', name: 'Artisan Pizza' },
    { id: 'burger', name: 'Smash Burgers' },
    { id: 'biriyani', name: 'Dum Biryani' },
    { id: 'sandwich', name: 'Club Sandwiches' },
    { id: 'fries', name: 'French Fries' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-stone-50/40 to-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Subtle Editorial Kicker - unboxed text per anti-pill guidelines */}
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Finest Kitchen · Fresh Ingredients · Fast Delivery</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] text-balance">
              Craving Delicious Food?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                Delivered Hot & Fresh.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              From bubbly wood-fired pizzas and juicy gourmet smash burgers to authentic fragrant royal dum biryani, artisan sandwiches, and crispy seasoned french fries. Handcrafted with love.
            </p>

            {/* Call to Actions & Quick Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-orange-200 transition-all cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('all')}
                className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm rounded-xl border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                View Full Menu
              </button>
            </div>

            {/* Quick Filter Tags (Interactive Buttons) */}
            <div className="pt-2">
              <div className="text-xs font-medium text-stone-500 mb-2">Popular Cravings:</div>
              <div className="flex flex-wrap gap-2">
                {quickFavorites.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectCategory(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedCategory === item.id
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 border-t border-stone-200 grid grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-medium">30 Min Fast Drop</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">100% Hygienic</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium">Chef Specially Made</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Photographic Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-900 aspect-16/10 sm:aspect-16/11 lg:aspect-4/3 group">
              <img
                src={HERO_IMAGE}
                alt="Delicious feast with artisan pizza, burger, biryani, and french fries"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              {/* Overlay Caption on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-0.5">
                  Chef's Grand Feast
                </div>
                <div className="text-sm sm:text-base font-bold text-white drop-shadow-xs">
                  Artisanal Pizzas, Smash Burgers, Biryani & Sides
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
