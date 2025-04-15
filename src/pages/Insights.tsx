
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { productForecasts } from "@/utils/mockData";
import { Lightbulb, TrendingUp, ArrowUpRight } from "lucide-react";
import { ProductForecast } from "@/types";
import { getProductForecasts } from "@/utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Insights() {
  const [forecasts, setForecasts] = useState<ProductForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForecast, setSelectedForecast] = useState<ProductForecast | null>(null);

  useEffect(() => {
    const fetchForecasts = async () => {
      setIsLoading(true);
      try {
        const response = await getProductForecasts();
        if (response.success && response.data) {
          setForecasts(response.data);
          if (response.data.length > 0) {
            setSelectedForecast(response.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching forecasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  return (
    <AppLayout allowedRoles={["admin"]}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Product Forecasts
              </CardTitle>
              <CardDescription>
                AI-powered demand predictions for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {forecasts.map((forecast) => (
                    <div
                      key={forecast.productId}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedForecast?.productId === forecast.productId
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedForecast(forecast)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{forecast.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Current Stock: {forecast.currentStock}
                          </p>
                        </div>
                        <Badge
                          variant={
                            forecast.currentStock <= forecast.reorderLevel
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {forecast.currentStock <= forecast.reorderLevel
                            ? "Restock"
                            : "OK"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedForecast ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {selectedForecast.productName} Forecast
                  </div>
                  {selectedForecast.recommendedPurchase > 0 && (
                    <Badge className="ml-2 bg-primary">
                      Recommended Purchase: {selectedForecast.recommendedPurchase} units
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  7-day sales prediction and inventory recommendation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedForecast.predictedSales}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getMonth() + 1}/${d.getDate()}`;
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} units`, 'Predicted Sales']}
                        labelFormatter={(label) => {
                          const d = new Date(label);
                          return d.toLocaleDateString();
                        }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="quantity"
                        name="Predicted Sales"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on historical sales patterns and current stock levels:
                  </p>
                  <div className="space-y-3">
                    {selectedForecast.currentStock <=
                    selectedForecast.reorderLevel ? (
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-destructive/20 p-1 mt-0.5">
                          <ArrowUpRight className="h-3 w-3 text-destructive" />
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Low stock alert:</span>{" "}
                          Current stock ({selectedForecast.currentStock} units)
                          is below reorder level (
                          {selectedForecast.reorderLevel} units).
                        </p>
                      </div>
                    ) : null}

                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                        <TrendingUp className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Weekly forecast:</span>{" "}
                        Predicted to sell{" "}
                        {selectedForecast.predictedSales.reduce(
                          (sum, day) => sum + day.quantity,
                          0
                        )}{" "}
                        units over the next 7 days.
                      </p>
                    </div>

                    {selectedForecast.recommendedPurchase > 0 ? (
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-success/20 p-1 mt-0.5">
                          <ArrowUpRight className="h-3 w-3 text-success" />
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">
                            Restocking recommendation:
                          </span>{" "}
                          Order {selectedForecast.recommendedPurchase} units to
                          maintain optimal inventory levels.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-success/20 p-1 mt-0.5">
                          <ArrowUpRight className="h-3 w-3 text-success" />
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Stock status:</span>{" "}
                          Current stock level is sufficient to meet predicted
                          demand.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Select a product to view forecasts
                </h3>
                <p className="text-muted-foreground">
                  AI-powered demand predictions help you make smarter inventory
                  decisions
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
