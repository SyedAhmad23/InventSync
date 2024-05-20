import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { ProductRequest } from "@/types/api";
import { Product } from "@/types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      query: () => ({
        url: API_ENDPOINTS.PRODUCT,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllProductsQuery } = productApi;
