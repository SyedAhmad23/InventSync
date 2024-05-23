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

export interface Role {
  id: number;
  name: string;
}
export interface Dashboard {
  totalCategories: number;
  totalInvoices: number;
  totalProducts: number;
  totalRecievables: number;
  totalRecieved: number;
  totalSales: number;
  recentInvoices: {
      _id: string;
      products: { name: string; }[];
      totalAmount: number;
      paid: boolean;
      createdAt: string;
  }[];
}

export interface Category {
  _id: number;
  name: string;
  description: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Invoice {
  _id: string;
  products: Product[];
  totalAmount: number;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Product {
  product: string | null;
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: string;
  image: string;
  category: Category;
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
