import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { ProductRequest } from "@/types/api";
import { Product, Supplier } from "@/types";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes:["Supplier"],
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<Supplier[], void>({
      query: () => ({
        url: API_ENDPOINTS.SUPPLIER,
        method: "GET",
      }),
      providesTags:["Supplier"],
    }),
    addSupplier: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.SUPPLIER,
        method: "POST",
        body: formData,
      }),
      invalidatesTags:["Supplier"],
    }),
    updateSupplier: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.SUPPLIER}/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags:["Supplier"],
    }),
    deleteSupplier: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.SUPPLIER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Supplier"],
    }),
  }),
});

export const {
  useGetAllSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
