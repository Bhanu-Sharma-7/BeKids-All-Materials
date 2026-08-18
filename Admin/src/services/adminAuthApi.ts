import { apiRequest } from './apiClient';
import { AdminProfile } from '../types/auth';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminProfile;
}

export const adminAuthApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(): Promise<{ success: boolean; admin: AdminProfile }> {
    return apiRequest<{ success: boolean; admin: AdminProfile }>('/admin/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/admin/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
  },
};
