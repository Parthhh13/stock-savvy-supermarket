
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { searchProducts, createSale } from "@/utils/api";
import { Product } from "@/types";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Receipt,
  ArrowLeft,
  Check
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [saleId, setSaleId] = useState("");
  const { toast } = useToast();
  const {
    items: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
  } = useCart();

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const res = await searchProducts(searchTerm);
          if (res.success && res.data) {
            setSearchResults(res.data);
          }
        } catch (error) {
          console.error("Error searching products:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast({
        title: "Product unavailable",
        description: "This product is out of stock",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, 1);
    setSearchTerm("");
    setSearchResults([]);
  };

  // Handle increase quantity
  const handleIncreaseQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  // Handle decrease quantity
  const handleDecreaseQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add products to the cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setIsCompleting(true);
    try {
      const res = await createSale(cartItems);
      if (res.success && res.data) {
        setSaleId(res.data.id);
        setIsReceiptVisible(true);
        clearCart();
        toast({
          title: "Sale completed",
          description: "Sale has been completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to complete the sale",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error completing sale:", error);
      toast({
        title: "Error",
        description: "Failed to complete the sale",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <AppLayout allowedRoles={["admin", "cashier"]}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Shopping Cart</CardTitle>
              <CardDescription>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground mb-2" />
                            <span>Your cart is empty</span>
                            <span className="text-sm text-muted-foreground">
                              Search for products to add to your cart
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cartItems.map((item) => (
                        <TableRow key={item.product.id}>
                          <TableCell className="font-medium">
                            {item.product.name}
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.product.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            ${item.product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDecreaseQuantity(item.product.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleIncreaseQuantity(item.product.id)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCompleting}
              >
                {isCompleting ? "Processing..." : "Complete Sale"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Product Search</CardTitle>
              <CardDescription>
                Search for products to add to the cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isSearching && (
                <div className="mt-4 text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Searching...
                  </p>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="mt-4 border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              {product.stock > 0 ? (
                                <span className="text-success">In Stock: {product.stock}</span>
                              ) : (
                                <span className="text-destructive">Out of Stock</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!isSearching && searchTerm && searchResults.length === 0 && (
                <div className="mt-4 text-center py-6">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No products found matching your search
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${(totalAmount * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout} disabled={cartItems.length === 0 || isCompleting}>
                <CreditCard className="mr-2 h-4 w-4" />
                {isCompleting ? "Processing..." : "Complete Sale"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptVisible} onOpenChange={setIsReceiptVisible}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-xl">
              <Receipt className="mr-2 h-5 w-5" />
              Sale Receipt
            </DialogTitle>
            <DialogDescription className="text-center">
              Sale completed successfully
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold">Stock Savvy Supermarket</h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Receipt #: {saleId}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Tax (10%)</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(totalAmount * 1.1).toFixed(2)}</span>
            </div>
            
            <div className="mt-8 flex items-center justify-center text-center">
              <div className="rounded-full bg-success/20 p-2">
                <Check className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Thank you for your purchase!
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsReceiptVisible(false)} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Billing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
