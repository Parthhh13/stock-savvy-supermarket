import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Product, ProductFilters } from "@/types";
import { getProducts, getProductCategories, getProductSuppliers, searchProducts } from "@/utils/api";
import { 
  Package, 
  Search, 
  Plus, 
  FileEdit, 
  Trash2,
  Filter,
  ArrowUpDown,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "all",
    supplier: "all",
    stockStatus: "all",
  });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    reorderLevel: 0,
    supplier: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Fetch products and filters on mount
  useEffect(() => {
    const fetchInventoryData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
          getProducts(),
          getProductCategories(),
          getProductSuppliers(),
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data);
          setFilteredProducts(productsRes.data);
        }

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }

        if (suppliersRes.success && suppliersRes.data) {
          setSuppliers(suppliersRes.data);
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, [toast]);

  // Apply filters when filters state changes
  useEffect(() => {
    let results = [...products];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      results = results.filter((p) => p.category === filters.category);
    }

    // Apply supplier filter
    if (filters.supplier && filters.supplier !== "all") {
      results = results.filter((p) => p.supplier === filters.supplier);
    }

    // Apply stock status filter
    if (filters.stockStatus === "low") {
      results = results.filter((p) => p.stock <= p.reorderLevel);
    } else if (filters.stockStatus === "outOfStock") {
      results = results.filter((p) => p.stock === 0);
    }

    // Apply sort if active
    if (sortConfig) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(results);
  }, [filters, products, sortConfig]);

  // Reset form state
  const resetForm = () => {
    setNewProduct({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      reorderLevel: 0,
      supplier: "",
    });
    setEditProduct(null);
    setProductToDelete(null);
  };

  // Handle add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call the API to add the product
    // For now, we'll just add it to the local state
    const mockNewProduct: Product = {
      id: `${products.length + 1}`,
      ...newProduct,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts([...products, mockNewProduct]);
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory`,
    });
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle edit product
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editProduct) return;
    
    // In a real app, this would call the API to update the product
    // For now, we'll just update it in the local state
    const updatedProducts = products.map((p) =>
      p.id === editProduct.id ? { ...editProduct, updatedAt: new Date().toISOString() } : p
    );

    setProducts(updatedProducts);
    toast({
      title: "Product Updated",
      description: `${editProduct.name} has been updated`,
    });
    
    setIsEditDialogOpen(false);
    resetForm();
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    // In a real app, this would call the API to delete the product
    // For now, we'll just remove it from the local state
    const updatedProducts = products.filter((p) => p.id !== productToDelete.id);

    setProducts(updatedProducts);
    toast({
      title: "Product Deleted",
      description: `${productToDelete.name} has been removed from inventory`,
    });
    
    setIsDeleteDialogOpen(false);
    resetForm();
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  // Request sort
  const requestSort = (key: keyof Product) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="ml-2 h-4 w-4 text-primary" />
      : <ArrowUpDown className="ml-2 h-4 w-4 text-primary rotate-180" />;
  };

  // Render stock status
  const renderStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return <Badge variant="outline" className="border-destructive text-destructive">Out of Stock</Badge>;
    }
    
    if (product.stock <= product.reorderLevel) {
      return <Badge variant="outline" className="border-warning text-warning">Low Stock</Badge>;
    }
    
    return <Badge variant="outline" className="border-success text-success">In Stock</Badge>;
  };

  return (
    <AppLayout allowedRoles={["admin", "staff"]}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Inventory Management</h1>
        
        {user?.role === "admin" && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      <div className="bg-white/10 rounded-lg border border-white/20 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              placeholder="Search products..."
              className="pl-10 text-white bg-white/10 border-white/20"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.supplier}
              onValueChange={(value) => setFilters({ ...filters, supplier: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.stockStatus}
              onValueChange={(value) => setFilters({ ...filters, stockStatus: value as any })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Status</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md border-white/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => requestSort('name')}>
                  Product Name {getSortIcon('name')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('category')}>
                  Category {getSortIcon('category')}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('price')}>
                  Price {getSortIcon('price')}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('stock')}>
                  Stock {getSortIcon('stock')}
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('supplier')}>
                  Supplier {getSortIcon('supplier')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground animate-pulse mb-2" />
                      <span>Loading inventory...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground mb-2" />
                      <span>No products found</span>
                      <span className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="text-white/90">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-center">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell className="text-center">
                      {renderStockStatus(product)}
                    </TableCell>
                    <TableCell className="text-center">{product.supplier}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user?.role === "admin" || user?.role === "cashier" ? (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        ) : null}
                        
                        {user?.role === "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEditProduct(product);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setProductToDelete(product);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to inventory
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    min="0"
                    value={newProduct.reorderLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details
            </DialogDescription>
          </DialogHeader>
          {editProduct && (
            <form onSubmit={handleEditProduct}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stock Quantity</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      min="0"
                      value={editProduct.stock}
                      onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-reorderLevel">Reorder Level</Label>
                    <Input
                      id="edit-reorderLevel"
                      type="number"
                      min="0"
                      value={editProduct.reorderLevel}
                      onChange={(e) => setEditProduct({ ...editProduct, reorderLevel: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-supplier">Supplier</Label>
                    <Input
                      id="edit-supplier"
                      value={editProduct.supplier}
                      onChange={(e) => setEditProduct({ ...editProduct, supplier: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Product</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {productToDelete && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium text-lg">{productToDelete.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Category: {productToDelete.category} • Stock: {productToDelete.stock}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProduct}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
