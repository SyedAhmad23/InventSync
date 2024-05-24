import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModalContent, ModalFooter } from "../ui/modal";
import {
  ProductFormSchema,
  ProductFormValues,
} from "@/schema/product-form.schema";
import { closeModal } from "@/feature/modal/modalSlice";
import { useUpdateProductMutation } from "@/feature/product/productApi";
import { Input } from "@/components/ui/input";
import { RootState } from "@/app/store/store";
import { Product, Supplier } from "@/types";
import NoImg from "@/assets/images/no-img.png";
import {
  SupplierFormSchema,
  SupplierFormValues,
} from "@/schema/supplier-form.schema";
import { useUpdateSupplierMutation } from "@/feature/supplier/supplierApi";

const UpdateSupplier: React.FC = () => {
  const modalState = useSelector((state: RootState) => state.modal);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const supplier = modalState.data.supplier as Supplier;
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SupplierFormValues>({
    resolver: yupResolver(SupplierFormSchema),
  });
  const [updateSupplier, { isLoading: isLoadingUpdate }] =
    useUpdateSupplierMutation();

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier?.name,
        email: supplier?.email,
        phone: supplier?.phone,
        address: supplier?.address,
        contact_person: supplier?.contact_person,
      });
    }
  }, [supplier, reset]);

  const onSubmit = async (data: SupplierFormValues) => {
    const { name, address, contact_person, email, phone } = data;
    let jsonData = {
      name,
      address,
      contact_person,
      email,
      phone,
    };

    try {
      //@ts-ignore
      await updateSupplier({ id: supplier._id, formData: jsonData }).unwrap();
      reset();
      dispatch(closeModal());
      toast.success("supplier updated successfully");
    } catch (error) {
      toast.error("Failed to update supplier");
    }
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
            <Button type="submit" loading={isLoadingUpdate}>
              Update Supplier
            </Button>
          </div>
        </ModalFooter>
      </form>
    </div>
  );
};

export default UpdateSupplier;
