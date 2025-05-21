// src/types/userTypes.ts

export interface RegisterUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin' ;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface UserState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}