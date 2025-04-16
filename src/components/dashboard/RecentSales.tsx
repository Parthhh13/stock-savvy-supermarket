
import { RecentSale } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface RecentSalesProps {
  sales: RecentSale[];
  isLoading?: boolean;
}

export function RecentSales({ sales, isLoading = false }: RecentSalesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Sales
          </CardTitle>
          <CardDescription>Latest transactions</CardDescription>
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
          <Receipt className="h-5 w-5" />
          Recent Sales
        </CardTitle>
        <CardDescription>Latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {format(new Date(sale.date), "MMM d, yyyy h:mm a")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {sale.items} {sale.items === 1 ? "item" : "items"} • {sale.cashierName}
                </p>
              </div>
              <div className="font-medium">${sale.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/reports">
              View All Transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
