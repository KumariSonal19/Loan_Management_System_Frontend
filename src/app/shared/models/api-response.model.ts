export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
  timestamp?: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  errors?: { [key: string]: string };
  details?: string;
  path?: string;
}
