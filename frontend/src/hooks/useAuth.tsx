"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { mockLogin, mockRegister } from "@/lib/mock-store";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("petcare_token");
      const storedUser = localStorage.getItem("petcare_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore parse errors
    }
    setIsLoading(false);
  }, []);

  const saveSession = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("petcare_token", t);
    localStorage.setItem("petcare_user", JSON.stringify(u));
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      saveSession(response.token, response.user);
    } catch {
      const response = mockLogin(email, password);
      saveSession(response.token, response.user);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string, role?: UserRole) => {
      try {
        const response = await api.register({ email, password, firstName, lastName, role });
        saveSession(response.token, response.user);
      } catch {
        const response = mockRegister({ email, password, firstName, lastName, role });
        saveSession(response.token, response.user);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("petcare_token");
    localStorage.removeItem("petcare_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
