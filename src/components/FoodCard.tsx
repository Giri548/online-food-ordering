import React from 'react';
import { FoodItem } from '../types/food';
import { Plus, Minus, Star, Clock, Flame, Info } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  quantityInCart: number;
  onAddToCart: (item: FoodItem) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onViewDetails: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onViewDetails,
}) => {
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-orange-200 transition-all duration-300">
      
      {/* Food Image Container */}
      <div 
        onClick={() => onViewDetails(item)}
        className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Veg / Non-Veg Indicator Dot in standard FSSAI / restaurant badge style */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
          <div
            className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center ${
              item.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>
        </div>

        {/* Clean Kicker / Quick Info Badges on Image */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {item.isBestseller && (
            <span className="bg-amber-500/95 text-white font-bold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
              Bestseller
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-rose-500/90 text-white font-semibold text-[11px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
              <Flame className="w-3 h-3" /> Spicy
            </span>
          )}
        </div>

        {/* Quick View Button overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(item);
          }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer backdrop-blur-xs"
        >
          <Info className="w-3.5 h-3.5" /> Details
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase font-semibold tracking-wider text-orange-600 text-[11px]">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{item.rating}</span>
              <span className="text-stone-400 text-[11px]">({item.reviewsCount})</span>
            </div>
          </div>

          {/* Food Title */}
          <h3 
            onClick={() => onViewDetails(item)}
            className="text-base sm:text-lg font-bold text-stone-900 hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
          >
            {item.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Prep time and Calories info */}
          <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{item.prepTime}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{item.calories}</span>
          </div>
        </div>

        {/* Footer: Price and Add To Cart Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-extrabold text-stone-900 tabular-nums">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Stepper Button */}
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-orange-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="inline-flex items-center bg-orange-50 border border-orange-200 rounded-xl overflow-hidden shadow-2xs">
              <button
                onClick={() => onUpdateQuantity(item.id, quantityInCart - 1)}
                className="w-8 h-8 flex items-center justify-center text-orange-700 hover:bg-orange-100 active:bg-orange-200 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-orange-900 text-sm tabular-nums">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, quantityInCart + 1)}
                className="w-8 h-8 flex items-center justify-center text-orange-700 hover:bg-orange-100 active:bg-orange-200 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </article>
  );
};
