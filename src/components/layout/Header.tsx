
import { Bell, Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Header({ sidebarOpen, toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-[#111827] via-[#192339] to-[#0F172A] border-b border-white/10 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="mr-2 text-white hover:bg-white/10"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">
          Stock Savvy Supermarket
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {(user?.role === "admin" || user?.role === "cashier") && (
          <Button
            variant="outline"
            size="icon"
            className="relative text-white hover:bg-white/10"
            onClick={() => navigate("/billing")}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2 text-white hover:bg-white/10">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#192339] border-white/10">
              <DropdownMenuLabel className="text-white/80">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/20">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-white/70">{user.email}</span>
                  <span className="text-xs text-white/70 capitalize mt-1">
                    Role: {user.role}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-400 hover:bg-white/10 focus:bg-white/20"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
