import { Product, User, chartStats, individualStats } from "@/types/index";

export interface APIPagination<T> {
  docs: T[];
  total: number;
  page: number;
  limit: number;
  currentCount: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
}

export interface APIResponseWithPagination<T> {
  data: APIPagination<T>;
  message: string;
}

export interface APIResponse<T> {
  message: string;
  data: T;
}

export interface APIErrorResponse {
  message: string;
  error: {
    statusCode: number;
    message: string[];
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CategoryRequest {
  name: string;
  description: string;
  restaurant_id: number;
}

export type TableRequest = {
  id?: string;
  table_name?: string;
  capacity?: number;
  branch_id?: number;
  floor_number?: number;
  qr_code?: string;
  status?: "occupied" | "unoccupied";
};
export interface StaffRequest {
  id: number;
  name: string;
  role: string;
  email: string;
  days_off: string;
  working_hours: string;
  date_joined: string;
  description: string;
  gender: string;
  contact_number: number;
  home_address: string;
  emergency_contact: string;
  profile_picture: string;
}

export interface ProductRequest {
  name: string;
  price: number;
  category_id?: number;
  description: string;
  image: Blob;
}

export interface UserUpdateRequest {
  image: File | null;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface DashboardStats {
  individualStats: {
    total_orders: individualStats;
    total_sales: individualStats;
    average_order_last_week: individualStats;
  };
  chartData: {
    todays_order_data: chartStats;
    last_weeks_order_data: chartStats;
    last_months_order_data: chartStats;
    todays_sales_data: chartStats;
    last_weeks_sales_data: chartStats;
    last_months_sales_data: chartStats;
  };
}
