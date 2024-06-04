import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Customer } from "@/types";
import { CustomerFormValues } from "@/schema/customer-form.schema";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getAllCustomers: builder.query<
      { customers: Customer[]; totalPages: number; totalCustomers: number },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `${API_ENDPOINTS.CUSTOMER}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    addCustomer: builder.mutation<void, CustomerFormValues>({
      query: (formData) => ({
        url: API_ENDPOINTS.CUSTOMER,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.CUSTOMER}/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.CUSTOMER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
