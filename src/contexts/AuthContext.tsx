import { createContext, useContext, useState, ReactNode } from "react";
import { apiPost, apiRequest, ApiError } from "@/lib/api";

interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

const AuthContext = createContext<{
  user: User | null;
  tokens: AuthTokens | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken?: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (full_name: string, email: string, password: string, password_confirm: string) => Promise<boolean>;
  loginWithGoogle: (response: any) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}>({ 
  user: null, 
  tokens: null,
  setUser: () => {},
  setTokens: () => {},
  login: async () => false,
  signup: async () => false,
  loginWithGoogle: async () => false,
  logout: () => {},
  refreshToken: async () => false
});

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "599251054902-9s286dlgrjg24fkkler7vdk873q9hgac.apps.googleusercontent.com";
const API_BASE_URL = "http://127.0.0.1:8000/api/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem("capsule_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tokens, setTokensState] = useState<AuthTokens | null>(() => {
    const saved = localStorage.getItem("capsule_tokens");
    return saved ? JSON.parse(saved) : null;
  });

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("capsule_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("capsule_user");
    }
    setUserState(user);
  };

  const setTokens = (accessToken: string, refreshToken?: string | null) => {
    const newTokens: AuthTokens = {
      access: accessToken,
      refresh: refreshToken || tokens?.refresh || ''
    };
    
    if (accessToken) {
      localStorage.setItem("capsule_tokens", JSON.stringify(newTokens));
    } else {
      localStorage.removeItem("capsule_tokens");
    }
    setTokensState(newTokens);
  };

  const saveAuthData = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData.access, tokenData.refresh);
  };

  const clearAuthData = () => {
    setUser(null);
    setTokens('', '');
    localStorage.removeItem("capsule_user");
    localStorage.removeItem("capsule_tokens");
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const requestData = { email, password };
      console.log("Sending login request:", requestData);
      
      const response = await apiPost(`${API_BASE_URL}/login/`, requestData, { skipAuth: true });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        saveAuthData(data.user, { access: data.access, refresh: data.refresh });
        return true;
      } else {
        console.error("Login failed:", data);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof ApiError && error.status === 401) {
        console.error("Authentication failed");
      }
      return false;
    }
  };

  const signup = async (full_name: string, email: string, password: string, password_confirm: string): Promise<boolean> => {
    try {
      const response = await apiPost(`${API_BASE_URL}/signup/`, { full_name, email, password, password_confirm }, { skipAuth: true });

      if (response.ok) {
        const data = await response.json();
        // Don't save auth data on signup - user needs to login
        console.log("User created successfully:", data.user);
        return true;
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        
        // Throw specific error to be handled by the component
        if (errorData.email && errorData.email[0].includes("already exists")) {
          throw new Error("Email already registered. Please use a different email or login.");
        } else if (errorData.password) {
          throw new Error("Password issue: " + errorData.password[0]);
        } else {
          throw new Error("Signup failed. Please check your information and try again.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof ApiError && error.status === 400) {
        console.error("Validation failed:", error.data);
      }
      throw error; // Re-throw to be handled by component
    }
  };

  const loginWithGoogle = async (response: any): Promise<boolean> => {
    try {
      const token = response.credential;
      
      // Send Google token to backend for proper verification
      const backendResponse = await apiPost(`${API_BASE_URL}/google-auth/`, {
        id_token: token
      }, { skipAuth: true });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        // Convert Google user to app User format
        const appUser: User = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          created_at: data.user.created_at
        };
        
        saveAuthData(appUser, { 
          access: data.access, 
          refresh: data.refresh 
        });
        console.log('Google authentication successful (proper OAuth)');
        return true;
      } else {
        const errorData = await backendResponse.json();
        console.error('Backend authentication failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (tokens?.refresh) {
      try {
        await apiPost(`${API_BASE_URL}/logout/`, { refresh: tokens.refresh });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    clearAuthData();
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!tokens?.refresh) return false;

    try {
      const response = await apiPost(`${API_BASE_URL}/refresh/`, { refresh: tokens.refresh }, { skipAuth: true, skipRefresh: true });

      if (response.ok) {
        const data = await response.json();
        const newTokens = { ...tokens, access: data.access };
        setTokens(data.access, tokens.refresh);
        localStorage.setItem("capsule_tokens", JSON.stringify(newTokens));
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      clearAuthData();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokens, setUser, setTokens, login, signup, loginWithGoogle, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
