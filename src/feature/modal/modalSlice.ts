import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalViews =
  | "ADD_PRODUCT"
  | "UPDATE_PRODUCT"
  | "DELETE_PERMISSION"
  | "ADD_CATEGORY"
  | "UPDATE_CATEGORY"
  | "ADD_INVOICE"
  | "ADD_SUPPLIER"
  | null;

interface ModalState {
  isOpen: boolean;
  view: ModalViews;
  data?: any;
}

const initialModalState: ModalState = {
  isOpen: false,
  view: null,
  data: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ view: ModalViews; data?: any }>
    ) => {
      state.view = action.payload.view;
      state.data = action.payload.data;
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.view = null;
      state.data = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
