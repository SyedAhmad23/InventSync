import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { Customer } from "@/types";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllCustomers: builder.query<Customer[], void>({
      query: () => ({
        url: API_ENDPOINTS.CUSTOMER,
        method: "GET",
      }),
    }),
    addCustomer: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.CUSTOMER,
        method: "POST",
        body: formData,
      }),
    }),
    updateCustomer: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${API_ENDPOINTS.CUSTOMER}/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteCustomer: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.CUSTOMER}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
    useGetAllCustomersQuery,
    useAddCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customerApi;