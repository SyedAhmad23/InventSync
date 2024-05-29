import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { ProductRequest } from "@/types/api";
import { Product } from "@/types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes:["Product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      query: () => ({
        url: API_ENDPOINTS.PRODUCT,
        method: "GET",
      }),
      providesTags:["Product"],
    }),
    importProducts: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.PRODUCT_UPLOAD,
        method: "POST",
        body: formData,
      }),
      invalidatesTags:["Product"],
    }),
    downloadProducts: builder.query<Product[], void>({
      query: () => ({
        url: API_ENDPOINTS.PRODUCT_DOWNLOAD,
        method: "GET",
      }),
      providesTags:["Product"],
    }),
    addProduct: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.PRODUCT,
        method: "POST",
        body: formData,
      }),
      invalidatesTags:["Product"],
    }),
    updateProduct: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.PRODUCT}/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags:["Product"],
    }),
    deleteProduct: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.PRODUCT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useDownloadProductsQuery,
  useImportProductsMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
