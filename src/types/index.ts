export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  type: string;
  price: number;
  previewUrl?: string;
  fileId?: string;
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

export interface Bundle {
  _id: string;
  name: string;
  slug: string;
  description: string;
  productIds: string[];
  price: number;
  discountPercent: number;
  isActive: boolean;
  products?: Product[];
}

export interface CartItem {
  id: string;
  type: "product" | "bundle";
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId?: string;
  email: string;
  status: "pending" | "completed" | "failed";
  total: number;
  stripeSessionId: string;
  createdAt: number;
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId?: string;
  bundleId?: string;
  price: number;
}

export interface DownloadToken {
  _id: string;
  orderId: string;
  productId: string;
  token: string;
  expiresAt: number;
  downloadCount: number;
  maxDownloads: number;
}
