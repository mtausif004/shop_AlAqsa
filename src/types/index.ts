export interface Product {
  productId: string;
  bengaliName: string;
  englishName: string;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  sku: string;
  weight: string;
  unit: string;
  ingredients: string;
  origin: string;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  offer: boolean;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  categoryId: string;
  bengaliName: string;
  englishName: string;
  slug: string;
  subcategories: string[];
  image: string;
  active: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  altPhone?: string;
  address: string;
  district: string;
  area?: string;
  deliveryZone: 'cox_bazar' | 'outside_cox';
  note?: string;
  paymentMethod: 'COD' | 'bKash' | 'Nagad';
}

export interface OrderItemSnapshot {
  orderId: string;
  productId: string;
  productNameSnapshot: string;
  sku: string;
  quantity: number;
  unitPriceSnapshot: number;
  discountSnapshot: number;
  subtotal: number;
  weight: string;
}

export interface OrderStatusHistoryItem {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  timestamp: string;
  admin: string;
  note?: string;
}

export interface Order {
  orderId: string;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  phone: string;
  alternativePhone?: string;
  address: string;
  district: string;
  area?: string;
  deliveryZone: string;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: 'COD' | 'bKash' | 'Nagad';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded' | 'Failed';
  orderStatus:
    | 'New'
    | 'Confirmed'
    | 'Processing'
    | 'Ready to Ship'
    | 'Shipped'
    | 'In Transit'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Delivery Failed'
    | 'Returned'
    | 'Cancelled';
  shippingStatus: string;
  courierId?: string;
  trackingNumber?: string;
  trackingUrl?: string; // Priority: 1. Admin Custom Tracking URL
  shippingDate?: string;
  estimatedDeliveryDate?: string;
  customerNote?: string;
  adminNote?: string;
  createdBy?: string;
  updatedBy?: string;
  items?: OrderItemSnapshot[];
  history?: OrderStatusHistoryItem[];
}

export interface Courier {
  courierId: string;
  courierName: string;
  website?: string;
  trackingUrlTemplate?: string; // e.g. https://steadfast.com.bd/t/[TRACKING_NUMBER]
  phone?: string;
  active: boolean;
}

export interface Banner {
  bannerId: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  active: boolean;
  order: number;
  style?: 'classic' | 'fade' | 'zoom' | 'ken_burns';
}

export interface Review {
  reviewId: string;
  productId: string;
  customerName: string;
  phone?: string;
  rating: number;
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  amount: number;
  minimumOrder: number;
  maximumDiscount?: number;
  active: boolean;
}

export interface Combo {
  comboId: string;
  name: string;
  description: string;
  productIds: string[];
  originalPrice: number;
  comboPrice: number;
  discount: number;
  image: string;
  active: boolean;
}

export interface AdminSession {
  token: string;
  adminId: string;
  username: string;
  role: string;
  expiresAt: number;
}

export interface AuditLog {
  auditId: string;
  orderId: string;
  adminId: string;
  timestamp: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason?: string;
}

export interface SecurityEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  details: Record<string, any>;
}
