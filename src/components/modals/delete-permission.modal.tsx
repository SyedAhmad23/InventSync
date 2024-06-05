import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/feature/modal/modalSlice";
import { ModalContent, ModalFooter } from "../ui/modal";
import { Button } from "@/components/ui/button";
import { RootState } from "@/app/store/store";

const DeleteCategory: React.FC = () => {
    const dispatch = useDispatch();
    const modalState = useSelector((state: RootState) => state.modal);

    return (
        <div>
            <ModalContent>
                <div className="px-6 gap-4">
                    <div className="mb-6 gap-2 flex flex-col">
                        <h2 className="text-lg font-semibold">
                            {modalState.data?.heading ||
                                "Are you sure you want to delete this item?"}
                        </h2>
                        <p className="text-gray-600 text-base font-normal">
                            {modalState.data?.description ||
                                "Deleting this item will remove its details from the system. This action cannot be undone."}
                        </p>
                    </div>
                </div>
            </ModalContent>
            <ModalFooter>
                <div className="flex justify-end items-end gap-3">
                    <Button
                        onClick={() => dispatch(closeModal())}
                        size="lg"
                        type="button"
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            modalState.data?.onConfirm && modalState.data.onConfirm();
                        }}
                        size="lg"
                        type="button"
                    >
                        Confirm
                    </Button>
                </div>
            </ModalFooter>
        </div>
    );
};

export default DeleteCategory;