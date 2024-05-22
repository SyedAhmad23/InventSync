import { Product } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  selectedProduct: Product | null;
}

const initialState: State = {
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
