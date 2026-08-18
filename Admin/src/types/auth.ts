export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN';
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminProfile | null;
  token: string | null;
}
