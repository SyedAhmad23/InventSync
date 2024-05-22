import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/feature/auth/authApi";
import { productApi } from "@/feature/product/productApi";
import modalSlice from "@/feature/modal/modalSlice";
import productSlice from "@/feature/product/productSlice";
import { categoryApi } from "@/feature/category/categoryApi";
import { invoiceApi } from "@/feature/invoice/invoiceApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,

    modal: modalSlice,
    product: productSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      invoiceApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
