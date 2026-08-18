import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminProfile, AdminAuthState } from '../types/auth';
import { adminAuthApi } from '../services/adminAuthApi';

interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bekids_admin_token'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('bekids_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await adminAuthApi.getMe();
        if (res.success && res.admin) {
          setAdmin(res.admin);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('bekids_admin_token');
          setToken(null);
        }
      } catch {
        localStorage.removeItem('bekids_admin_token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await adminAuthApi.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('bekids_admin_token', res.token);
        setToken(res.token);
        setAdmin(res.admin);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } finally {
      localStorage.removeItem('bekids_admin_token');
      setToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        admin,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
