
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export function AppLayout({ 
  children, 
  requireAuth = true,
  allowedRoles = [] 
}: AppLayoutProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // If auth is still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111827] via-[#192339] to-[#0F172A]">
        <div className="animate-pulse text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">Loading...</div>
      </div>
    );
  }
  
  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific roles are required, check if user has the required role
  if (
    requireAuth && 
    isAuthenticated && 
    allowedRoles.length > 0 && 
    !allowedRoles.includes(user?.role || '')
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#111827] via-[#192339] to-[#0F172A] p-4">
        <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-600">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <a href="/" className="px-4 py-2 gradient-primary rounded">
          Return to Dashboard
        </a>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out p-0 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
          <div className="p-4 md:p-6 min-h-[calc(100vh-64px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
