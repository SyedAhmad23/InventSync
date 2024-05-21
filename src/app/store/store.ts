import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/feature/auth/authApi";
import { productApi } from "@/feature/product/productApi";
import modalSlice from "@/feature/modal/modalSlice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    modal: modalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
