import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { ProductRequest } from "@/types/api";
import { Category, Product } from "@/types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: API_ENDPOINTS.CATEGORY,
        method: "GET",
      }),
    }),
    addCategory: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.CATEGORY,
        method: "POST",
        body: formData,
      }),
    }),
    updateCategory: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.CATEGORY}/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteCategory: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.CATEGORY}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
