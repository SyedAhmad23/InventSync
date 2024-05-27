"use client";
import React from "react";
import Layout from "@/components/layout/layout";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Category, Customer } from "@/types";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/feature/modal/modalSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
} from "@/feature/customer/customerApi";

const CustomerPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllCustomersQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const dispatch = useDispatch();
  //@ts-ignore
  const finaldata = data;
  console.log(finaldata);
  if (isLoading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>Error...</Layout>;

  const handleAddCustomer = () => {
    dispatch(
      openModal({ view: "ADD_CUSTOMER", data: { title: "Add Customer" } })
    );
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomer({ id }).unwrap();
      toast.success("Customer deleted successfully");
      dispatch(closeModal());
    } catch (error) {
      toast.error("Failed to delete Customer");
    }
  };

  const onDeleteCustomer = (id: string) => {
    dispatch(
      openModal({
        view: "DELETE_PERMISSION",
        data: {
          title: "Delete Customer",
          id,
          onConfirm: () => handleDeleteCustomer(id),
        },
      })
    );
  };

  const handleUpdateCategory = (selectedCustomer: Customer) => {
    dispatch(
      openModal({
        view: "UPDATE_CUSTOMER",
        data: { customer: selectedCustomer },
      })
    );
  };

  return (
    <Layout>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={handleAddCustomer}>
            <MdAdd className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Customer
            </span>
          </Button>
        </div>
      </div>

      <Card className=" mt-10">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Manage your Customers and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                {/* <TableHead className="hidden md:table-cell">
                  Description
                </TableHead> */}
                <TableHead>
                  <span className="hidden md:table-cell">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finaldata?.map((customer: Customer) => (
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">
                    {customer.customer_name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.email}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MdRemoveRedEye className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleUpdateCategory(customer)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteCustomer(customer._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CustomerPage;
