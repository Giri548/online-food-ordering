import React, { useState } from 'react';
import { FoodItem } from '../types/food';
import { X, Star, Clock, Flame, Plus, Minus, Check, ShoppingBag } from 'lucide-react';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, instructions?: string) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity, instructions);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="uppercase text-xs font-semibold tracking-wider text-amber-300">
              {item.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
              <span className="text-stone-300">({item.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                {item.name}
              </h2>
              <div className="text-xl font-extrabold text-stone-900 tabular-nums">
                ₹{item.price * quantity}
              </div>
            </div>
            
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-xs">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{item.prepTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{item.calories}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              <span className="capitalize">{item.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}</span>
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Fresh Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {item.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Special Cooking Instructions Note */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra napkins, less spicy, sauce on the side..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-hidden"
              maxLength={120}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-stone-900 active:bg-stone-100 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-stone-900 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-stone-900 active:bg-stone-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            disabled={addedNotice}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white transition-all shadow-xs cursor-pointer ${
              addedNotice ? 'bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600 active:scale-98'
            }`}
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4" /> Added to Order!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add ₹{item.price * quantity} to Cart
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
