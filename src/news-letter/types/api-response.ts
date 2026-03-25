export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: any | null;
}



  export interface ApiResponse2<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: any;
  timestamp?: string;
}