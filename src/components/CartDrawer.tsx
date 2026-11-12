import React, { useState } from 'react';
import { CartItem } from '../types/food';
import { PROMO_CODES } from '../data/foodItems';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (discountAmount: number, promoCodeApplied: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate pricing math
  const subtotal = items.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity,
    0
  );

  let discount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (subtotal >= promo.minSpend) {
      if (promo.discountPercent) {
        discount = (subtotal * promo.discountPercent) / 100;
      } else if (promo.discountAmount) {
        discount = Math.min(promo.discountAmount, subtotal);
      }
    }
  }

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 299 || appliedPromo === 'FREEDEL' ? 0 : 40;
  const tax = subtotal > 0 ? (subtotal - discount) * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + tax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();

    if (!code) return;

    if (PROMO_CODES[code]) {
      const promo = PROMO_CODES[code];
      if (subtotal < promo.minSpend) {
        setPromoError(`Minimum spend of ₹${promo.minSpend} required for this code`);
        return;
      }
      setAppliedPromo(code);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try FOODIE20 or FIRSTBITE');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Your Cart</h2>
              <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full tabular-nums">
                {items.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Looks like you haven't added any mouthwatering food items yet. Add delicious pizzas, burgers, or biriyani to start ordering!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Explore Food Menu
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Progress bar */}
                {subtotal < 299 ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900">
                    <div className="flex items-center justify-between mb-1.5 font-medium">
                      <span>Add ₹{(299 - subtotal).toFixed(0)} more for <strong>FREE Delivery</strong></span>
                      <span className="tabular-nums font-bold">{Math.round((subtotal / 299) * 100)}%</span>
                    </div>
                    <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-600 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, (subtotal / 299) * 100)}%` }} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlocked <strong>FREE Doorstep Delivery</strong>!</span>
                  </div>
                )}

                {/* Items */}
                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <div key={item.foodItem.id} className="py-3.5 flex gap-3 first:pt-0">
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-sm font-bold text-stone-900 truncate">
                              {item.foodItem.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.foodItem.id)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-stone-500 tabular-nums">
                            ₹{item.foodItem.price} each
                          </div>
                          {item.specialNotes && (
                            <div className="text-[11px] text-amber-700 italic truncate mt-0.5">
                              "{item.specialNotes}"
                            </div>
                          )}
                        </div>

                        {/* Quantity Stepper & Line Total */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center bg-stone-100 rounded-lg border border-stone-200">
                            <button
                              onClick={() => onUpdateQuantity(item.foodItem.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 transition-colors rounded-l-lg cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-stone-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.foodItem.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 transition-colors rounded-r-lg cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-sm font-extrabold text-stone-900 tabular-nums">
                            ₹{item.foodItem.price * item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-orange-500" />
                    <span>Have a Promo Code?</span>
                  </div>

                  {appliedPromo ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Code <strong>{appliedPromo}</strong> applied!</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-stone-400 hover:text-stone-700 underline text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try FOODIE20 or FIRSTBITE"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-hidden uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <div className="mt-1 text-[11px] text-rose-600">{promoError}</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    ₹{subtotal.toFixed(0)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedPromo})</span>
                    <span className="tabular-nums">-₹{discount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Restaurant GST (5%)</span>
                  <span className="tabular-nums">₹{tax.toFixed(0)}</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600 tabular-nums">
                    ₹{grandTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => onProceedToCheckout(discount, appliedPromo || '')}
                className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Place Order</span>
                <span className="font-semibold tabular-nums text-orange-100">
                  (₹{grandTotal.toFixed(0)})
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
