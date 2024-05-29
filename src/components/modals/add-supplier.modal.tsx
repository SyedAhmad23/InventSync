import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { closeModal } from "@/feature/modal/modalSlice";
import { Input } from "@/components/ui/input";
import { useAddSupplierMutation } from "@/feature/supplier/supplierApi";
import {
  SupplierFormSchema,
  SupplierFormValues,
} from "@/schema/supplier-form.schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import Modal, { ModalContent, ModalFooter } from "../ui/modal";

const AddSupplier = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: yupResolver(SupplierFormSchema),
  });
  const [addSupplier, { isLoading: isLoadingCreate }] =
    useAddSupplierMutation();

  const onSubmit = (data: SupplierFormValues) => {
    const { name, address, contact_person, email, phone } = data;
    const jsonData = { name, address, contact_person, email, phone };
    //@ts-ignore
    addSupplier(jsonData)
      .then(() => {
        reset();
        dispatch(closeModal());
        toast.success("Supplier added successfully");
      })
      .catch((error) => {
        toast.error("Failed to add Supplier");
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <div className="grid lg:grid-cols-2 gap-4">
            <Input
              {...register("name")}
              id="name"
              label="Name"
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
            <Input
              {...register("address")}
              id="address"
              label="Address"
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red-600">{errors.address.message}</p>
            )}
            <Input
              {...register("contact_person")}
              id="contact_person"
              label="Contact Person"
              placeholder="Enter contact person"
            />
            {errors.contact_person && (
              <p className="text-red-600">{errors.contact_person.message}</p>
            )}
            <Input
              {...register("email")}
              id="email"
              label="Email"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
            <Input
              {...register("phone")}
              id="phone"
              label="Phone"
              placeholder="Enter phone"
            />
            {errors.phone && (
              <p className="text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </ModalContent>
        <ModalFooter>
          <div className="flex justify-end items-end gap-3">
            <Button
              onClick={() => dispatch(closeModal())}
              className="px-9"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoadingCreate}>
              Add Product
            </Button>
          </div>
        </ModalFooter>
      </form>
    </div>
  );
};

export default AddSupplier;
