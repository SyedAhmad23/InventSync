import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ModalContent, ModalFooter } from "../ui/modal";
import { closeModal } from "@/feature/modal/modalSlice";
import { Input } from "@/components/ui/input";
import { RootState } from "@/app/store/store";
import { Customer } from "@/types";
import {
  CustomerFormSchema,
  CustomerFormValues,
} from "@/schema/customer-form.schema";
import { useUpdateCustomerMutation } from "@/feature/customer/customerApi";

const UpdateCustomer: React.FC = () => {
  const modalState = useSelector((state: RootState) => state.modal);
  const customer = modalState.data.customer as Customer;
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(CustomerFormSchema),
  });
  const [updateCustomer, { isLoading: isLoadingUpdate }] =
    useUpdateCustomerMutation();

  useEffect(() => {
    if (customer) {
      reset({
        customer_name: customer?.customer_name,
        phone: customer?.phone,
        email: customer?.email,
      });
      console.log(customer.customer_name, "name");
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormValues) => {
    const { customer_name, phone, email } = data;
    let jsonData = {
      customer_name,
      phone,
      email,
    };
    try {
      //@ts-ignore
      await updateCustomer({ id: customer._id, formData: jsonData }).unwrap();
      reset();
      dispatch(closeModal());
      toast.success("customer updated successfully");
    } catch (error) {
      toast.error("Failed to update customer");
    }
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
                id="name"
                label="Customer Name"
                placeholder="Enter name"
                required={true}
                error={errors.customer_name?.message}
              />
            </div>
            <div className="grid gap-y-4 mt-3">
              <Input
                {...register("phone")}
                id="phone"
                type="number"
                label="Customer Contact"
                placeholder="Enter Phone"
                required={true}
                error={errors.phone?.message}
              />
            </div>
            <div className="grid gap-y-4 mt-3">
              <Input
                {...register("email")}
                id="email"
                type="email"
                label="Customer Email"
                placeholder="Enter Email"
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
            <Button type="submit" loading={isLoadingUpdate}>
              Update Customer
            </Button>
          </div>
        </ModalFooter>
      </form>
    </div>
  );
};

export default UpdateCustomer;
