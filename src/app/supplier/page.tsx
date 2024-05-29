"use client";
import React from "react";
import Layout from "@/components/layout/layout";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Category, Supplier } from "@/types";
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
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/feature/category/categoryApi";
import {
  useDeleteSupplierMutation,
  useGetAllSuppliersQuery,
} from "@/feature/supplier/supplierApi";
import AddSupplier from "@/components/modals/add-supplier.modal";

const CategoryPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllSuppliersQuery();
  const [deleteSupplier] = useDeleteSupplierMutation();
  const dispatch = useDispatch();
  //@ts-ignore
  const finaldata = data;
  console.log(finaldata);
  if (isLoading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>Error...</Layout>;

  const handleAddSupplier = () => {
    dispatch(
      openModal({ view: "ADD_SUPPLIER", data: { title: "Add Supplier" } })
    );
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteSupplier({ id }).unwrap();
      toast.success("Supplier deleted successfully");
      dispatch(closeModal());
    } catch (error) {
      toast.error("Failed to delete Supplier");
    }
  };

  const onDeleteSupplier = (id: string) => {
    dispatch(
      openModal({
        view: "DELETE_PERMISSION",
        data: {
          title: "Delete Supplier",
          id,
          onConfirm: () => handleDeleteSupplier(id),
        },
      })
    );
  };

  const handleUpdateSupplier = (selectedSUpplier: Supplier) => {
    dispatch(
      openModal({
        view: "UPDATE_SUPPLIER",
        data: { supplier: selectedSUpplier },
      })
    );
  };

  return (
    <Layout>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={handleAddSupplier}>
            <MdAdd className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Supplier
            </span>
          </Button>
        </div>
      </div>

      <Card className=" mt-10">
        <CardHeader>
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>
            Manage your Suppliers and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead >
                  Contact Person
                </TableHead>
                <TableHead >Email</TableHead>
                <TableHead >Phone</TableHead>
                <TableHead >Address</TableHead>
                <TableHead>
                  <span >Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finaldata?.map((supplier: Supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableHead >
                    {supplier.contact_person}
                  </TableHead>
                  <TableCell >
                    {supplier.email}
                  </TableCell>
                  <TableCell >
                    {supplier.phone}
                  </TableCell>
                  <TableCell >
                    {supplier.address}
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
                          onClick={() => handleUpdateSupplier(supplier)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          //@ts-ignore
                          onClick={() => onDeleteSupplier(supplier._id)}
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

export default CategoryPage;
