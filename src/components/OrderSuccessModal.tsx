import React, { useState, useEffect } from 'react';
import { Order } from '../types/food';
import { CheckCircle2, Clock, MapPin, ChefHat, Bike, Home, Printer, X, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderAgain: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onOrderAgain,
}) => {
  const [activeStep, setActiveStep] = useState(1); // 1 = Received, 2 = Cooking, 3 = On Way, 4 = Delivered

  useEffect(() => {
    if (!order) return;
    // Simulate real-time kitchen progress updates
    const timer1 = setTimeout(() => setActiveStep(2), 5000);
    const timer2 = setTimeout(() => setActiveStep(3), 15000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { num: 1, label: 'Order Confirmed', sub: 'Kitchen accepted', icon: CheckCircle2 },
    { num: 2, label: 'Preparing', sub: 'Chefs cooking fresh', icon: ChefHat },
    { num: 3, label: 'On The Way', sub: 'Delivery partner assigned', icon: Bike },
    { num: 4, label: 'Delivered', sub: 'Enjoy your meal!', icon: Home },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Hidden during print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer print:hidden"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-100 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Thank you, {order.customer.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-md mx-auto">
            Your delicious meal is now being freshly prepared. Estimated arrival time: <strong>{order.estimatedDeliveryTime}</strong>
          </p>
        </div>

        {/* Live Order Stepper Tracker */}
        <div className="p-4 sm:p-6 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center justify-between relative">
            {/* Background connecting track */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
            <div 
              className="absolute top-4 left-6 h-0.5 bg-orange-500 transition-all duration-700 -z-0"
              style={{ width: `${((activeStep - 1) / 3) * 85}%` }}
            />

            {steps.map((st) => {
              const Icon = st.icon;
              const isPast = activeStep >= st.num;
              const isCurrent = activeStep === st.num;
              return (
                <div key={st.num} className="relative z-1 flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-white text-stone-400 border border-stone-200'
                    } ${isCurrent ? 'ring-4 ring-orange-100 scale-110' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 ${isPast ? 'text-stone-900' : 'text-stone-400'}`}>
                    {st.label}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-stone-400">
                    {st.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Receipt */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
            <div>
              <span className="text-stone-400">Order ID:</span>{' '}
              <span className="font-bold text-stone-900">{order.id}</span>
            </div>
            <div>
              <span className="text-stone-400">Time:</span>{' '}
              <span className="text-stone-700">{order.createdAt}</span>
            </div>
            <div>
              <span className="text-stone-400">Payment:</span>{' '}
              <span className="font-semibold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {order.customer.paymentMethod}
              </span>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-xl text-xs">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-stone-900">Delivery Address</div>
              <div className="text-stone-600">{order.customer.address}</div>
              <div className="text-stone-500">Contact: {order.customer.phone}</div>
            </div>
          </div>

          {/* Itemized summary */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h4>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map((item) => (
                <div key={item.foodItem.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-orange-600">{item.quantity}x</span>
                    <span className="font-medium text-stone-800">{item.foodItem.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-stone-900">
                    ₹{item.foodItem.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="pt-2 border-t border-stone-200 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-stone-900">₹{order.subtotal.toFixed(0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="tabular-nums font-medium">-₹{order.discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="tabular-nums font-medium text-stone-900">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span className="tabular-nums font-medium text-stone-900">₹{order.tax.toFixed(0)}</span>
            </div>
            <div className="pt-1.5 border-t border-stone-200 flex justify-between font-extrabold text-sm text-stone-900">
              <span>Total Paid</span>
              <span className="text-orange-600 tabular-nums">₹{order.total.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Actions Bar (Print receipt & Order more) */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOrderAgain}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Order More Food
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
