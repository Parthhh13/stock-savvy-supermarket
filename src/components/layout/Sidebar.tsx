
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Home,
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  Lightbulb,
  Settings,
  Store,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

// Navigation item definition
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

// Navigation items
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    roles: ["admin", "cashier", "staff"],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["admin", "staff"],
  },
  {
    title: "Billing",
    href: "/billing",
    icon: ShoppingCart,
    roles: ["admin", "cashier"],
  },
  {
    title: "AI Insights",
    href: "/insights",
    icon: Lightbulb,
    roles: ["admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Store,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );
  
  return (
    <aside
      className={cn(
        "bg-sidebar fixed left-0 top-16 bottom-0 w-64 border-r border-border transition-transform duration-300 ease-in-out transform z-20",
        {
          "-translate-x-full md:translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
            Menu
          </h2>
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-auto px-3 py-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-1 font-medium">Need Help?</h3>
            <p className="text-xs text-muted-foreground mb-2">
              Check our documentation for help with using the system.
            </p>
            <Link
              to="/help"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
