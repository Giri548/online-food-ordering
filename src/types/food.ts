export interface FoodItem {
  id: string;
  name: string;
  category: 'pizza' | 'burger' | 'biriyani' | 'sandwich' | 'fries' | 'dessert' | 'drinks';
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  ingredients: string[];
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedSize?: 'regular' | 'large';
  specialNotes?: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  deliveryNotes?: string;
  paymentMethod: 'cod' | 'card' | 'upi';
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
  createdAt: string;
  estimatedDeliveryTime: string;
}
