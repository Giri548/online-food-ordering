import React from 'react';
import { ShoppingBag, Search, Code2, Clock, UtensilsCrossed, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenJavaGuide: () => void;
  onOpenOrders: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenJavaGuide,
  onOpenOrders,
  ordersCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                  Foodie<span className="text-orange-500">.</span>
                </span>
              </div>
            </a>

            {/* Quick Promo / delivery pill removed per anti-pill guidelines - replaced with clean inline text */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-stone-500">
              <span className="text-orange-600 font-semibold">Free Delivery</span>
              <span aria-hidden="true">·</span>
              <span>On orders over ₹299</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> 30-45 Mins
              </span>
            </div>
          </div>

          {/* Search Box in Center */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search pizza, burger, biriyani, fries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-100 hover:bg-stone-100/80 focus:bg-white text-stone-800 placeholder-stone-400 text-sm rounded-xl border border-transparent focus:border-orange-500 focus:outline-hidden transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links and Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Java JSP/Servlet source code & student project guide button */}
            <button
              onClick={onOpenJavaGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              title="View complete Java JSP, Servlet & MySQL project source code"
            >
              <Code2 className="w-4 h-4 text-orange-600" />
              <span className="hidden sm:inline">JSP/Servlet Source</span>
              <span className="sm:hidden">Java</span>
            </button>

            {/* My Orders button */}
            {ordersCount > 0 && (
              <button
                onClick={onOpenOrders}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-orange-600 bg-white hover:bg-orange-50 border border-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                <span>Orders</span>
                <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center">
                  {ordersCount}
                </span>
              </button>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="tabular-nums font-bold">
                {cartCount > 0 ? (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">
                    {cartCount}
                  </span>
                ) : (
                  '0'
                )}
              </span>
              {cartTotal > 0 && (
                <span className="hidden md:inline text-xs font-bold pl-1 border-l border-white/20 tabular-nums">
                  ₹{cartTotal.toFixed(0)}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search pizza, burger, biriyani..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-100 text-stone-800 placeholder-stone-400 text-sm rounded-xl border border-transparent focus:border-orange-500 focus:bg-white focus:outline-hidden transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
