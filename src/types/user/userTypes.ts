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

}

export interface LoginResponse {
  success: boolean;
  message: string;
  data:{
    user: User
    token: string;
}
  };


export interface  UserState {
  currentUser: User | null;
  userToken: string | null;
  isAuthenticated: boolean;
}
