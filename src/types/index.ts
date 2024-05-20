export interface User {
  id: number;
  name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  emergency_contact: string;
  home_address: string;
  profile_picture: string | null;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  email: string;
  address: string;
  contact_number: string;
  cover_image: string;
  profile_image: string;
  branches: RestaurantBranch[];
}

export interface RestaurantWithBranch {
  id: number;
  name: string;
  restaurant_id: number;
}
export interface RestaurantBranch {
  id: number;
  name: string;
  country: string;
  state: string;
  address: string;
  contact_number: string;
  stripe_account_id: null | string;
  restaurant_id: number;
  restaurant: Restaurant;
  is_active: "active" | "inactive";
}

export type PaymentMode = "cash" | "card" | "applePay";

export type TableOrderState =
  | "pending"
  | "progress"
  | "confirmed"
  | "completed"
  | "closed";

export interface Table {
  id?: string;
  table_name?: string;
  qr_code?: string | null;
  floor_number?: number;
  capacity?: number;
  status?: "occupied" | "unoccupied";
  branch_id?: number;
}

export interface Addon {
  id: number;
  name: string;
  price: number;
  restaurant_id: number;
  restaurant: Restaurant;
}

export interface Offer {
  id: number;
  offer_title: string;
  active_from: string;
  active_until: string;
  voucher_code: string;
  discount_type: "fixed" | "percentage";
  discount_value: string;
  status: "active" | "inactive";
  restaurant_id: number;
  restaurant: Restaurant;
}

export interface Allergen {
  id: number;
  name: string;
}
export interface OrderItem {
  id: number;
  menu_title: string;
  individual_price: number;
  quantity: number;
  order_notes: string | null;
  menu_item_id: number;
  placed_order_id: number;
  addons: Addon[];
}

export interface Order {
  id: number;
  initial_cost: number;
  tip_percentage: number;
  discount_amount: number;
  final_cost: number;
  order_time: string;
  estimated_delivery_time: string;
  voucher_code: string | null;
  order_status: "in_progress" | "ready" | "completed";
  branch_id: number;
  branch_name: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_table: Table;
  order_items: OrderItem[];
}

export interface Staff {
  id: number;
  // staff_role: Role;
  date_joined: string;
  days_off: string;
  role: string;
  role_id: number;
  working_hours: string;
  name: string;
  email: string;
  gender: string;
  password: string;
  confirm_password?: string;
  date_of_birth: string;
  contact_number: string;
  emergency_contact: string;
  home_address: string;
  profile_picture: string;
}
export interface Role {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  restaurant_id: number;
  restaurant: Restaurant;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  ingredients: string;
  image: string;
  // addon_ids: number[];
  // allergen_ids: number[];
  // restaurant_id: number;
  // restaurant: Restaurant;
  // category: Category;
  // addons: Addon[];
  // allergens: Allergen[];
}

export type individualStats = {
  amount: number;
  percentageChange: number;
  hasIncreased: boolean;
};

export type chartStats = {
  amount: number;
  chartData: {
    labels: string[];
    data: number[];
  };
};

export type OrderStatus = "in_progress" | "ready" | "completed";
