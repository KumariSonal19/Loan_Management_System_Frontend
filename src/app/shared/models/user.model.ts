export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'LOAN_OFFICER' | 'CUSTOMER';
  active?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  accessToken: string;
  expiresIn: number;
}
