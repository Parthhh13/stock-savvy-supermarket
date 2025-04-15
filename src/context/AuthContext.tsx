
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { login as apiLogin, logout as apiLogout, getCurrentUser, getToken, isAuthenticated } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";

// Default auth state
const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create auth context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const { toast } = useToast();
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = getToken();
        const user = getCurrentUser();
        const isAuth = isAuthenticated();
        
        setAuthState({
          user,
          token,
          isAuthenticated: isAuth,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          ...defaultAuthState,
          isLoading: false,
          error: "Failed to initialize authentication",
        });
      }
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { user, token } = await apiLogin(email, password);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    apiLogout();
    
    setAuthState({
      ...defaultAuthState,
      isLoading: false,
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
