
import { 
  Product, 
  Sale, 
  ProductForecast, 
  ApiResponse, 
  DashboardStats, 
  BestSellingProduct, 
  StockAlert,
  RecentSale,
  SaleItem,
  User,
  CartItem
} from "@/types";
import { 
  products, 
  productForecasts, 
  dashboardStats, 
  bestSellingProducts, 
  stockAlerts, 
  recentSales 
} from "./mockData";
import { getCurrentUser } from "./auth";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API wrapper
async function api<T>(endpoint: string, method = 'GET', data?: any): Promise<ApiResponse<T>> {
  try {
    // Simulate API delay
    await delay(Math.random() * 800 + 200); // Random delay between 200-1000ms
    
    // Mock API routes
    switch (endpoint) {
      case '/auth/login':
        // This is handled separately in auth.ts
        break;

      case '/products':
        if (method === 'GET') {
          return { success: true, data: products as unknown as T };
        } else if (method === 'POST' && data) {
          // Simulate adding a product
          const newProduct = {
            ...data,
            id: `${products.length + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { success: true, data: newProduct as unknown as T, message: 'Product added successfully' };
        }
        break;

      case `/products/${data?.id}`:
        if (method === 'GET') {
          const product = products.find(p => p.id === data.id);
          if (product) {
            return { success: true, data: product as unknown as T };
          }
          return { success: false, error: 'Product not found' };
        } else if (method === 'PUT' && data) {
          // Simulate updating a product
          return { success: true, data: data as unknown as T, message: 'Product updated successfully' };
        } else if (method === 'DELETE') {
          // Simulate deleting a product
          return { success: true, message: 'Product deleted successfully' };
        }
        break;

      case '/dashboard/stats':
        return { success: true, data: dashboardStats as unknown as T };

      case '/dashboard/best-selling':
        return { success: true, data: bestSellingProducts as unknown as T };

      case '/dashboard/stock-alerts':
        return { success: true, data: stockAlerts as unknown as T };

      case '/dashboard/recent-sales':
        return { success: true, data: recentSales as unknown as T };

      case '/ai/forecasts':
        return { success: true, data: productForecasts as unknown as T };

      case '/ai/forecast':
        if (data?.productId) {
          const forecast = productForecasts.find(f => f.productId === data.productId);
          if (forecast) {
            return { success: true, data: forecast as unknown as T };
          }
          return { success: false, error: 'Forecast not found' };
        }
        break;

      case '/sales':
        if (method === 'POST' && data) {
          // Simulate creating a sale
          const newSale = {
            id: `sale${Date.now()}`,
            items: data.items,
            totalAmount: data.totalAmount,
            date: new Date().toISOString(),
            cashierId: getCurrentUser()?.id ?? '',
            cashierName: getCurrentUser()?.name ?? '',
          };
          
          // Update product stock
          data.items.forEach((item: SaleItem) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              product.stock = Math.max(0, product.stock - item.quantity);
            }
          });
          
          return { success: true, data: newSale as unknown as T, message: 'Sale completed successfully' };
        }
        break;

      default:
        return { success: false, error: 'Invalid endpoint' };
    }
    
    return { success: false, error: 'Operation failed' };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Product API functions
export const getProducts = () => api<Product[]>('/products');

export const getProduct = (id: string) => api<Product>(`/products/${id}`, 'GET', { id });

export const createProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
  api<Product>('/products', 'POST', product);

export const updateProduct = (product: Product) => 
  api<Product>(`/products/${product.id}`, 'PUT', product);

export const deleteProduct = (id: string) => 
  api<void>(`/products/${id}`, 'DELETE', { id });

// Dashboard API functions
export const getDashboardStats = () => api<DashboardStats>('/dashboard/stats');

export const getBestSellingProducts = () => api<BestSellingProduct[]>('/dashboard/best-selling');

export const getStockAlerts = () => api<StockAlert[]>('/dashboard/stock-alerts');

export const getRecentSales = () => api<RecentSale[]>('/dashboard/recent-sales');

// AI API functions
export const getProductForecasts = () => api<ProductForecast[]>('/ai/forecasts');

export const getProductForecast = (productId: string) => 
  api<ProductForecast>('/ai/forecast', 'GET', { productId });

// Sales API functions
export const createSale = (items: CartItem[]) => {
  const saleItems: SaleItem[] = items.map(item => ({
    productId: item.product.id,
    product: item.product,
    quantity: item.quantity,
    price: item.product.price,
    total: item.product.price * item.quantity
  }));
  
  const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0);
  
  return api<Sale>('/sales', 'POST', { items: saleItems, totalAmount });
};

// Search products helper
export const searchProducts = (query: string, category?: string, supplier?: string) => {
  let results = [...products];
  
  if (query) {
    const searchLower = query.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.id.toLowerCase().includes(searchLower)
    );
  }
  
  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }
  
  if (supplier && supplier !== 'all') {
    results = results.filter(p => p.supplier === supplier);
  }
  
  return Promise.resolve({ success: true, data: results });
};

// Get product categories
export const getProductCategories = () => {
  const categories = [...new Set(products.map(p => p.category))];
  return Promise.resolve({ success: true, data: categories });
};

// Get product suppliers
export const getProductSuppliers = () => {
  const suppliers = [...new Set(products.map(p => p.supplier))];
  return Promise.resolve({ success: true, data: suppliers });
};
