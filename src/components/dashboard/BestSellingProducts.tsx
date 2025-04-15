
import { BestSellingProduct } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface BestSellingProductsProps {
  products: BestSellingProduct[];
  isLoading?: boolean;
}

export function BestSellingProducts({
  products,
  isLoading = false,
}: BestSellingProductsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Best Selling Products
          </CardTitle>
          <CardDescription>Top performing products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-full h-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5" />
          Best Selling Products
        </CardTitle>
        <CardDescription>Top performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <Badge
                          className={
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-zinc-400"
                              : "bg-amber-600"
                          }
                        >
                          #{index + 1}
                        </Badge>
                      )}
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{product.quantitySold}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${product.revenue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link to="/reports">
              View Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
