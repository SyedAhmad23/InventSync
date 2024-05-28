import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Customer, Invoice, Product } from "@/types";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllInvoices: builder.query<Invoice[], void>({
      query: () => ({
        url: API_ENDPOINTS.INVOICE,
        method: "GET",
      }),
    }),
    getInvoice: builder.query<Invoice, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.INVOICE}/${id}`,
        method: "GET",
      }),
    }),

    addInvoice: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.INVOICE,
        method: "POST",
        body: formData,
      }),
    }),
    updateInvoice: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.INVOICE}/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteInvoice: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.INVOICE}/${id}`,
        method: "DELETE",
      }),
    }),
    searchProducts: builder.query<Product[], string>({
      query: (searchTerm) => ({
        url: `${API_ENDPOINTS.INVOICE}/search-product/${searchTerm}`,
        method: "GET",
      }),
    }),
    getProductDetails: builder.query<Product, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.INVOICE}/get-product/${id}`,
        method: "GET",
      }),
    }),
    searchCustomers: builder.query<Customer[], string>({
      query: (searchTerm) => ({
        url: `${API_ENDPOINTS.INVOICE}/search-customer/${searchTerm}`,
        method: "GET",
      }),
    }),
    getCustomerDetails: builder.query<Customer, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.INVOICE}/get-customer/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllInvoicesQuery,
  useGetInvoiceQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSearchProductsQuery,
  useGetProductDetailsQuery,
  useSearchCustomersQuery,
  useGetCustomerDetailsQuery,
} = invoiceApi;
