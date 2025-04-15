
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { BestSellingProducts } from "@/components/dashboard/BestSellingProducts";
import { RecentSales } from "@/components/dashboard/RecentSales";
import {
  getDashboardStats,
  getBestSellingProducts,
  getStockAlerts,
  getRecentSales,
} from "@/utils/api";
import {
  DashboardStats,
  BestSellingProduct,
  StockAlert,
  RecentSale,
} from "@/types";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { BarChart } from "@/components/dashboard/BarChart";
import { monthlySalesData, categorySalesData } from "@/utils/mockData";
import { DoughnutChart } from "@/components/dashboard/DoughnutChart";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bestSelling, setBestSelling] = useState<BestSellingProduct[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, bestSellingRes, alertsRes, salesRes] = await Promise.all([
          getDashboardStats(),
          getBestSellingProducts(),
          getStockAlerts(),
          getRecentSales(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (bestSellingRes.success && bestSellingRes.data) {
          setBestSelling(bestSellingRes.data);
        }

        if (alertsRes.success && alertsRes.data) {
          setStockAlerts(alertsRes.data);
        }

        if (salesRes.success && salesRes.data) {
          setRecentSales(salesRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          description="Total products in inventory"
          icon={Package}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Sales"
          value={stats?.totalSales ?? 0}
          description="Total sales made"
          icon={ShoppingCart}
          iconColor="text-green-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Revenue"
          value={`$${stats?.totalRevenue.toFixed(2) ?? "0.00"}`}
          description="Total revenue generated"
          icon={DollarSign}
          iconColor="text-amber-500"
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockCount ?? 0}
          description="Products needing attention"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="grid gap-6 h-full">
          <BestSellingProducts products={bestSelling} isLoading={isLoading} />
        </div>
        <div className="grid gap-6 h-full">
          <StockAlerts alerts={stockAlerts} isLoading={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <BarChart data={monthlySalesData} title="Monthly Sales (2023)" />
        </div>
        <div>
          <DoughnutChart data={categorySalesData} title="Sales by Category" />
        </div>
      </div>

      <div className="mt-6">
        <RecentSales sales={recentSales} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
}
