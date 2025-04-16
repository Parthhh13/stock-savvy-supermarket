
import { User } from "@/types";
import { users } from "./mockData";

// Mock auth functions
const TOKEN_KEY = 'supermarket-auth-token';
const USER_KEY = 'supermarket-user';

// Login function
export const login = (email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would be a server request to validate credentials
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // For demo, we'll accept any password that's not empty
      if (user && password.length > 0) {
        // Generate mock JWT token
        const token = `mock-jwt-token-${user.id}-${Date.now()}`;
        
        // Save to localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        resolve({ user, token });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
    }
  }
  return null;
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Check user role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

// Check if user is cashier
export const isCashier = (): boolean => {
  return hasRole('cashier');
};

// Check if user is staff
export const isStaff = (): boolean => {
  return hasRole('staff');
};
