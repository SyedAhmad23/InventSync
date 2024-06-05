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
import { ModalContent, ModalFooter } from "../ui/modal";

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
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-3">
            <div>
              <Input
                {...register("name")}
                id="name"
                label="Name"
                placeholder="Enter name"
                required={true}
                error={errors.name?.message}
              />
            </div>
            <div>
              <Input
                {...register("address")}
                id="address"
                label="Address"
                placeholder="Enter address"
                required={true}
                error={errors.address?.message}
              />
            </div>
            <div>
              <Input
                {...register("contact_person")}
                id="contact_person"
                label="Contact Person"
                placeholder="Enter contact person"
                required={true}
                error={errors.contact_person?.message}
              />
            </div>
            <div>
              <Input
                {...register("email")}
                id="email"
                label="Email"
                placeholder="Enter email"
                required={true}
                error={errors.email?.message}
              />
            </div>
            <div>
              <Input
                {...register("phone")}
                id="phone"
                label="Phone"
                placeholder="Enter phone"
                required={true}
                error={errors.phone?.message}
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <div className="flex justify-end items-end gap-3">
            <Button
              onClick={() => dispatch(closeModal())}
              variant="secondary"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoadingCreate}>
              Add Supplier
            </Button>
          </div>
        </ModalFooter>
      </form>
    </div>
  );
};

export default AddSupplier;