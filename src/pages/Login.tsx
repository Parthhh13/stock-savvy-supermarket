
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Store, ShieldCheck, Users } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsSubmitting(true);
    let demoEmail = "";
    
    switch (role) {
      case "admin":
        demoEmail = "admin@supermarket.com";
        break;
      case "cashier":
        demoEmail = "cashier@supermarket.com";
        break;
      case "staff":
        demoEmail = "staff@supermarket.com";
        break;
      default:
        demoEmail = "admin@supermarket.com";
    }
    
    try {
      await login(demoEmail, "password");
      navigate("/");
    } catch (error) {
      console.error("Demo login failed:", error);
      toast({
        title: "Demo Login Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Store className="h-10 w-10 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-primary">Stock Savvy Supermarket</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or try a demo account
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={() => handleDemoLogin("admin")}
                disabled={isSubmitting}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={() => handleDemoLogin("cashier")}
                disabled={isSubmitting}
              >
                <Store className="h-4 w-4 mr-2" />
                Cashier
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={() => handleDemoLogin("staff")}
                disabled={isSubmitting}
              >
                <Users className="h-4 w-4 mr-2" />
                Staff
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
