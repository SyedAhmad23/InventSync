import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Dashboard } from "@/types";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllDashboardItems: builder.query<Dashboard[], void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllDashboardItemsQuery,
} = dashboardApi;