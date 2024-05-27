import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ModalContent, ModalFooter } from "../ui/modal";
import { closeModal } from "@/feature/modal/modalSlice";
import { Input } from "@/components/ui/input";
import { useAddCustomerMutation } from "@/feature/customer/customerApi";
import {
  CustomerFormSchema,
  CustomerFormValues,
} from "@/schema/customer-form.schema";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(CustomerFormSchema),
  });
  const [addCustomer, { isLoading: isLoadingCreate }] =
    useAddCustomerMutation();

  const onSubmit = (data: CustomerFormValues) => {
    const { customer_name, phone, email } = data;
    const jsonData = { customer_name, phone, email };
    //@ts-ignore
    addCustomer(jsonData)
      .then(() => {
        reset();
        dispatch(closeModal());
        toast.success("Customer added successfully");
      })
      .catch((error: any) => {
        toast.error("Failed to add Customer", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <div className="mt-6">
            <p className="text-base font-medium">Customer Information</p>
            <div className="grid gap-y-4 mt-3">
              <Input
                {...register("customer_name")}
                id="customer_name"
                label="Customer Name"
                placeholder="Enter name"
              />
              {errors.customer_name && (
                <p className="text-red-600">{errors.customer_name.message}</p>
              )}
              <Input
                {...register("phone")}
                id="phone"
                type="number"
                label="Customer Contact"
                placeholder="Enter Phone"
              />
              {errors.phone && (
                <p className="text-red-600">{errors.phone.message}</p>
              )}
              <Input
                {...register("email")}
                id="email"
                type="email"
                label="Customer Email"
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
              {/* <Input {...register("address")} id="name" label="Customer Name" placeholder="Enter name" />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>} */}
            </div>
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
            <Button type="submit" disabled={isLoadingCreate}>
              {isLoadingCreate ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </div>
  );
};

export default AddCustomer;
