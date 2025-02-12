"use client";
import React, { useState } from "react";
import Layout from "@/components/layout/layout";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/feature/modal/modalSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
} from "@/feature/customer/customerApi";
import { Customer } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const CustomerPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, error, isLoading } = useGetAllCustomersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const totalPages = data?.totalPages;
  const totalCustomers = data?.totalCustomers;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [deleteCustomer] = useDeleteCustomerMutation();
  const dispatch = useDispatch();

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

      <Card className="mt-10">
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
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableBody>
                {Array(4)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-10 rounded-sm" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            ) : (
              <TableBody>
                {data?.customers.map((customer: Customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">
                      {customer.customer_name}
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
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
            )}
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    className={
                      index + 1 === currentPage
                        ? "font-semibold bg-slate-200"
                        : ""
                    }
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default CustomerPage;
