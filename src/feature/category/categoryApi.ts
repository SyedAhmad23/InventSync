import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Category } from "@/types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: API_ENDPOINTS.CATEGORY,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    importCategories: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.CATEGORY_UPLOAD,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    downloadCategories: builder.query<Category[], void>({
      query: () => ({
        url: API_ENDPOINTS.CATEGORY_DOWNLOAD,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.CATEGORY,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.CATEGORY}/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.CATEGORY}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useDownloadCategoriesQuery,
  useImportCategoriesMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
