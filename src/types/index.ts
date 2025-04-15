
// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'staff';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderLevel: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  supplier: string;
  stockStatus: 'all' | 'low' | 'outOfStock';
}

// Sale Types
export interface SaleItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  createdAt: string;
  cashierId: string;
  cashierName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Forecast Types
export interface ForecastPoint {
  date: string;
  quantity: number;
}

export interface ProductForecast {
  productId: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
  predictedSales: ForecastPoint[];
  recommendedPurchase: number;
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  lowStockCount: number;
}

export interface BestSellingProduct {
  id: string;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface RecentSale {
  id: string;
  date: string;
  items: number;
  amount: number;
  cashierName: string;
}

export interface StockAlert {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  supplier: string;
  status: 'low' | 'outOfStock';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
