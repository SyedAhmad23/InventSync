import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Invoice, Product } from "@/types";

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
  }),
});

export const {
  useGetAllInvoicesQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSearchProductsQuery,
  useGetProductDetailsQuery,
} = invoiceApi;
