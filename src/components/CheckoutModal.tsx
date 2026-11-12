import React, { useState } from 'react';
import { CartItem, OrderCustomer } from '../types/food';
import { X, MapPin, Phone, User, CreditCard, Banknote, QrCode, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  promoCode: string;
  onOrderPlaced: (customer: OrderCustomer, totals: { subtotal: number; deliveryFee: number; discount: number; tax: number; total: number }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  promoCode,
  onOrderPlaced,
}) => {
  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    address: '',
    city: 'Downtown Core',
    deliveryNotes: '',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderCustomer, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity,
    0
  );
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 299 || promoCode === 'FREEDEL' ? 0 : 40;
  const tax = subtotal > 0 ? (subtotal - discount) * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + tax);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderCustomer, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 8) newErrors.phone = 'Valid phone number is required';
    if (!formData.address.trim() || formData.address.length < 5) newErrors.address = 'Detailed delivery address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(formData, {
        subtotal,
        deliveryFee,
        discount,
        tax,
        total: grandTotal,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              Checkout & Delivery Details
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Confirm your delivery address and preferred payment mode
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          
          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-orange-500" />
              <span>Contact & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Recipient Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                {errors.fullName && <div className="text-[11px] text-rose-500 mt-1">{errors.fullName}</div>}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                {errors.phone && <div className="text-[11px] text-rose-500 mt-1">{errors.phone}</div>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Complete Street Address & Flat/Apt <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B, Near Central Park"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              {errors.address && <div className="text-[11px] text-rose-500 mt-1">{errors.address}</div>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Leave at front door, ring doorbell twice"
                value={formData.deliveryNotes}
                onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Cash on Delivery */}
              <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'cod'
                  ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="accent-orange-500"
                  />
                </div>
                <span className="text-xs font-bold text-stone-900">Cash on Delivery</span>
                <span className="text-[11px] text-stone-500">Pay when food arrives</span>
              </label>

              {/* UPI / Instant QR */}
              <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'upi'
                  ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <QrCode className="w-5 h-5 text-indigo-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className="accent-orange-500"
                  />
                </div>
                <span className="text-xs font-bold text-stone-900">UPI / QR Scan</span>
                <span className="text-[11px] text-stone-500">GPay, PhonePe, Paytm</span>
              </label>

              {/* Card */}
              <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'card'
                  ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className="accent-orange-500"
                  />
                </div>
                <span className="text-xs font-bold text-stone-900">Credit / Debit Card</span>
                <span className="text-[11px] text-stone-500">Visa, Mastercard, Amex</span>
              </label>
            </div>
          </div>

          {/* Mini Order Summary */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{subtotal.toFixed(0)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({promoCode})</span>
                <span className="tabular-nums">-₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span className="font-semibold tabular-nums">
                {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Tax (5% GST)</span>
              <span className="tabular-nums">₹{tax.toFixed(0)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Grand Total</span>
              <span className="text-orange-600 font-black tabular-nums">₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-98 disabled:opacity-70 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting Order to Foodie Kitchen...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Place Order (₹{grandTotal.toFixed(0)})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              Safe & Contactless Delivery · 100% Fresh & Authentic Guarantee
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
