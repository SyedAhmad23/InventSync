import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { ProductRequest } from "@/types/api";
import { Product, Supplier } from "@/types";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<Supplier[], void>({
      query: () => ({
        url: API_ENDPOINTS.SUPPLIER,
        method: "GET",
      }),
    }),
    addSupplier: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.SUPPLIER,
        method: "POST",
        body: formData,
      }),
    }),
    updateSupplier: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.SUPPLIER}/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteSupplier: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.SUPPLIER}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
