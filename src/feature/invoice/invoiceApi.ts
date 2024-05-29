import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Customer, Invoice, Product } from "@/types";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    getAllInvoices: builder.query<Invoice[], void>({
      query: () => ({
        url: API_ENDPOINTS.INVOICE,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),
    getInvoice: builder.query<Invoice, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.INVOICE}/${id}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),

    addInvoice: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.INVOICE,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Invoice"],
    }),
    updateInvoice: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.INVOICE}/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Invoice"],
    }),
    deleteInvoice: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.INVOICE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
    searchProducts: builder.query<Product[], string>({
      query: (searchTerm) => ({
        url: `${API_ENDPOINTS.INVOICE}/search-product/${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),
    getProductDetails: builder.query<Product, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.INVOICE}/get-product/${id}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),
    searchCustomers: builder.query<Customer[], string>({
      query: (searchTerm) => ({
        url: `${API_ENDPOINTS.INVOICE}/search-customer/${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),
    getCustomerDetails: builder.query<Customer, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.INVOICE}/get-customer/${id}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
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
