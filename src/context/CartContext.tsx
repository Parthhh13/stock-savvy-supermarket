
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Cart context type
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key
const CART_STORAGE_KEY = "supermarket-cart";

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  
  // Add product to cart
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock} units available`,
        variant: "destructive",
      });
      return;
    }
    
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id
      );
      
      if (existingItem) {
        // Check if we have enough stock
        if (product.stock < existingItem.quantity + quantity) {
          toast({
            title: "Insufficient stock",
            description: `Only ${product.stock} units available`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        // Update existing item
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name}`,
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setItems(prevItems =>
      prevItems.filter(item => item.product.id !== productId)
    );
    
    toast({
      title: "Removed from cart",
      description: "Item removed from cart",
    });
  };
  
  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.product.id === productId) {
          // Check if we have enough stock
          if (item.product.stock < quantity) {
            toast({
              title: "Insufficient stock",
              description: `Only ${item.product.stock} units available`,
              variant: "destructive",
            });
            return item;
          }
          
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Cart hook
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
