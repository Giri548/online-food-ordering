import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FoodCard } from './components/FoodCard';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { JavaJspProjectGuideModal } from './components/JavaJspProjectGuideModal';
import { Footer } from './components/Footer';
import { FOOD_ITEMS, CATEGORIES } from './data/foodItems';
import { FoodItem, CartItem, Order, OrderCustomer } from './types/food';
import { 
  Sparkles, 
  Pizza, 
  Flame, 
  Utensils, 
  Layers, 
  ShoppingBag, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Check, 
  Code2 
} from 'lucide-react';

const CART_STORAGE_KEY = 'foodie_cart_v1';
const ORDERS_STORAGE_KEY = 'foodie_orders_v1';

export default function App() {
  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state persisted in localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  // UI Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedFoodForDetails, setSelectedFoodForDetails] = useState<FoodItem | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isJavaGuideOpen, setIsJavaGuideOpen] = useState(false);

  // Applied discount in checkout
  const [checkoutDiscount, setCheckoutDiscount] = useState<{ amount: number; code: string }>({ amount: 0, code: '' });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Cart operations
  const handleAddToCart = (item: FoodItem, quantity = 1, specialNotes?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.foodItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.foodItem.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity, specialNotes: specialNotes || ci.specialNotes }
            : ci
        );
      }
      return [...prev, { foodItem: item, quantity, specialNotes }];
    });
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}${item.name} to cart`);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) => (ci.foodItem.id === itemId ? { ...ci, quantity: newQty } : ci))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.foodItem.id !== itemId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Cart cleared');
  };

  const handleProceedToCheckout = (discountAmount: number, promoCodeApplied: string) => {
    setCheckoutDiscount({ amount: discountAmount, code: promoCodeApplied });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (
    customer: OrderCustomer,
    totals: { subtotal: number; deliveryFee: number; discount: number; tax: number; total: number }
  ) => {
    const newOrderId = `FD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const createdOrder: Order = {
      id: newOrderId,
      customer,
      items: [...cartItems],
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      status: 'confirmed',
      createdAt: formattedDate,
      estimatedDeliveryTime: '30-40 Mins',
    };

    setOrders((prev) => [createdOrder, ...prev]);
    setCurrentOrder(createdOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
  };

  const handleReorder = (order: Order) => {
    setCartItems(order.items);
    setIsCartOpen(true);
    showToast(`Loaded ${order.items.length} items from ${order.id} into cart`);
  };

  // Scroll to menu
  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cart summary calculations
  const totalCartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, ci) => acc + ci.foodItem.price * ci.quantity, 0);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !item.isVeg) return false;
      if (dietaryFilter === 'non-veg' && item.isVeg) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients.some((ing) => ing.toLowerCase().includes(query));
        return matchesName || matchesCategory || matchesDesc || matchesIngredients;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Recommended default: Bestsellers first
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return b.rating - a.rating;
    });
  }, [selectedCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenJavaGuide={() => setIsJavaGuideOpen(true)}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        ordersCount={orders.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreMenu={scrollToMenu}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            scrollToMenu();
          }}
          selectedCategory={selectedCategory}
        />

        {/* Food Menu & Ordering Section */}
        <section ref={menuRef} id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Freshly Prepared For You
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Explore Our Food Menu
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Choose from artisan pizzas, gourmet burgers, authentic dum biryani, grilled sandwiches, and crispy french fries.
              </p>
            </div>

            {/* Filter controls row: Dietary & Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Dietary Toggle buttons */}
              <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer ${
                    dietaryFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  All Food
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    dietaryFilter === 'veg'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-stone-500 hover:text-emerald-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Veg
                </button>
                <button
                  onClick={() => setDietaryFilter('non-veg')}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    dietaryFilter === 'non-veg'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-stone-500 hover:text-rose-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Non-Veg
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative inline-flex items-center">
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-8 pr-7 py-2 bg-stone-100 border border-stone-200 hover:border-stone-300 text-stone-800 text-xs font-semibold rounded-xl appearance-none focus:outline-hidden focus:border-orange-500 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat.id === 'all' && <Sparkles className="w-4 h-4 text-orange-400" />}
                  {cat.id === 'pizza' && <Pizza className="w-4 h-4 text-amber-500" />}
                  {cat.id === 'burger' && <Flame className="w-4 h-4 text-orange-500" />}
                  {cat.id === 'biriyani' && <Utensils className="w-4 h-4 text-amber-600" />}
                  {cat.id === 'sandwich' && <Layers className="w-4 h-4 text-stone-500" />}
                  {cat.id === 'fries' && <Sparkles className="w-4 h-4 text-amber-400" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Search & Filter Indicator */}
          {(searchQuery || selectedCategory !== 'all' || dietaryFilter !== 'all') && (
            <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
              <div>
                Showing <strong>{filteredItems.length}</strong> items
                {selectedCategory !== 'all' && <> in <strong>{selectedCategory}</strong></>}
                {dietaryFilter !== 'all' && <> ({dietaryFilter === 'veg' ? 'Vegetarian only' : 'Non-Vegetarian only'})</>}
                {searchQuery && <> matching "<strong>{searchQuery}</strong>"</>}
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setDietaryFilter('all');
                  setSearchQuery('');
                }}
                className="text-orange-600 hover:text-orange-700 font-semibold underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Food Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto text-orange-500">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-800">
                No food items found
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                We couldn't find any dish matching your current filter. Try searching for "pizza", "burger", "biriyani", or reset the filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setDietaryFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                View Full Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const inCart = cartItems.find((ci) => ci.foodItem.id === item.id);
                const quantityInCart = inCart ? inCart.quantity : 0;
                return (
                  <FoodCard
                    key={item.id}
                    item={item}
                    quantityInCart={quantityInCart}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onViewDetails={setSelectedFoodForDetails}
                  />
                );
              })}
            </div>
          )}

          {/* Java JSP & Servlet Architecture Showcase Banner */}
          <div className="mt-16 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 uppercase tracking-widest">
                <Code2 className="w-4 h-4" /> Java Web Development Ready
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Looking for the Java (JSP / Servlet) & MySQL Source Code?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                We've provided complete, beginner-friendly runnable Java classes (<code>DBConnection.java</code>, <code>FoodDAO.java</code>, <code>CartServlet.java</code>), JSP views (<code>index.jsp</code>, <code>cart.jsp</code>), MySQL schema, and Tomcat deployment instructions.
              </p>
            </div>

            <button
              onClick={() => setIsJavaGuideOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Explore JSP/Servlet Source Code</span>
            </button>
          </div>

        </section>
      </main>

      {/* Floating Bottom Cart Bar for Mobile Viewports */}
      {totalCartCount > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-stone-900 hover:bg-black text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-stone-800 cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold tabular-nums">
                {totalCartCount}
              </div>
              <span className="text-xs font-bold text-stone-200">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in Cart
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-orange-400 tabular-nums">
                ₹{cartSubtotal.toFixed(0)}
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                View Cart →
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Modals and Drawers */}
      <FoodDetailModal
        item={selectedFoodForDetails}
        onClose={() => setSelectedFoodForDetails(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={checkoutDiscount.amount}
        promoCode={checkoutDiscount.code}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderSuccessModal
        order={currentOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onOrderAgain={() => {
          setIsOrderSuccessOpen(false);
          scrollToMenu();
        }}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onReorder={handleReorder}
      />

      <JavaJspProjectGuideModal
        isOpen={isJavaGuideOpen}
        onClose={() => setIsJavaGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenJavaGuide={() => setIsJavaGuideOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToMenu();
        }}
      />

    </div>
  );
}
