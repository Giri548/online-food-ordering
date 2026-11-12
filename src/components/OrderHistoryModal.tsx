import React from 'react';
import { Order } from '../types/food';
import { X, Clock, MapPin, CheckCircle, PackageOpen, ArrowRight, RotateCcw } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReorder: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">Your Order History</h2>
            <p className="text-xs text-stone-500">Track current and previous Foodie orders</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <PackageOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-800">No orders yet</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Once you place an order for pizza, burger, biriyani or fries, it will appear here for easy tracking!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-2xs hover:border-orange-200 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900">{order.id}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle className="w-3 h-3" /> Confirmed
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{order.createdAt}</span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs space-y-1">
                    {order.items.map((it) => (
                      <div key={it.foodItem.id} className="flex justify-between text-stone-700">
                        <span>
                          <strong className="text-orange-600 font-bold">{it.quantity}x</strong> {it.foodItem.name}
                        </span>
                        <span className="tabular-nums font-medium text-stone-900">
                          ₹{it.foodItem.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer with address and reorder */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-stone-500 flex items-center gap-1 max-w-xs truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{order.customer.address}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-stone-900 tabular-nums">
                        ₹{order.total.toFixed(0)}
                      </span>
                      <button
                        onClick={() => {
                          onReorder(order);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
