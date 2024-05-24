"client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { ModalViews } from "@/feature/modal/modalSlice";
import { RootState } from "@/app/store/store";
import Modal from "../ui/modal";

const AddProductModal = dynamic(
  () => import("@/components/modals/add-product.modal")
);
const UpdateProductModal = dynamic(
  () => import("@/components/modals/update-product.modal")
);
const AddCategoryModal = dynamic(
  () => import("@/components/modals/add-category.modal")
);
const UpdateCategoryModal = dynamic(
  () => import("@/components/modals/update-category.modal")
);
const AddSupplierModal = dynamic(
  () => import("@/components/modals/add-supplier.modal")
);
const UpdateSupplierModal = dynamic(
  () => import("@/components/modals/update-supplier.modal")
);

const DeleteModal = dynamic(
  () => import("@/components/modals/delete-permission.modal")
);

function renderView(view: ModalViews) {
  switch (view) {
    case "ADD_PRODUCT":
      return <AddProductModal />;
    case "UPDATE_PRODUCT":
      return <UpdateProductModal />;
    case "ADD_CATEGORY":
      return <AddCategoryModal />;
    case "UPDATE_CATEGORY":
      return <UpdateCategoryModal />;
    case "ADD_SUPPLIER":
      return <AddSupplierModal />;
    case "UPDATE_SUPPLIER":
      return <UpdateSupplierModal />;
    case "DELETE_PERMISSION":
      return <DeleteModal />;
    default:
      return <></>;
  }
}

export default function ManagedModal() {
  const modalState = useSelector((state: RootState) => state.modal);

  return (
    <Modal isOpen={modalState.isOpen} title={modalState.data?.title || ""}>
      {renderView(modalState.view)}
    </Modal>
  );
}
