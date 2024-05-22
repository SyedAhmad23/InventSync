"use client";
import React from "react";
import Layout from "@/components/layout/layout";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Invoice } from "@/types";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/feature/modal/modalSlice";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
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
import { useDeleteInvoiceMutation, useGetAllInvoicesQuery, useUpdateInvoiceMutation } from "@/feature/invoice/invoiceApi";

const ProductPage: React.FC = () => {
    const { data, error, isLoading } = useGetAllInvoicesQuery();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const [updateInvoice, { isLoading: isLoadingUpdate }] = useUpdateInvoiceMutation();

    const dispatch = useDispatch();
    //@ts-ignore
    const finaldata = data;
    console.log(finaldata);
    if (isLoading) return <Layout>Loading...</Layout>;
    if (error) return <Layout>Error...</Layout>;

    const handleAddProduct = () => {
        console.log("Add Product button clicked");
        dispatch(
            openModal({ view: "ADD_PRODUCT", data: { title: "Add Product" } })
        );
    };

    const handleDeleteInvoice = async (id: string) => {
        try {
            await deleteInvoice({ id }).unwrap();
            toast.success("Invoice deleted successfully");
            dispatch(closeModal());
        } catch (error) {
            toast.error("Failed to delete Invoice");
        }
    };

    const onDeleteCategory = (id: string) => {
        dispatch(
            openModal({
                view: "DELETE_PERMISSION",
                data: {
                    title: "Delete Invoice",
                    id,
                    onConfirm: () => handleDeleteInvoice(id),
                },
            })
        );
    };

    const handleUpdateInvoice = (selectedInvoice: Invoice) => {
        dispatch(openModal({ view: "UPDATE_PRODUCT", data: { invoice: selectedInvoice } }));
    };

    const togglePaymentStatus = async (invoice: Invoice) => {
        const updatedInvoice = { ...invoice, paid: !invoice.paid };
        try {
            //@ts-ignore
            await updateInvoice({ id: invoice._id, data: updatedInvoice }).unwrap();
            toast.success("Invoice status updated successfully");
        } catch (error) {
            toast.error("Failed to update invoice status");
        }
    };
    const getTotalQuantity = (products: any[]) => {
        return products.reduce((total, product) => total + product.quantity, 0);
    };
    return (
        <Layout>
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddProduct}>
                        <MdAdd className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Invoice
                        </span>
                    </Button>
                </div>
            </div>

            <Card className=" mt-10">
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>
                        Manage your Categories and view their sales performance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">CreatedAt</TableHead>
                                <TableHead className="hidden md:table-cell">UpdatedAt</TableHead>
                                <TableHead className="hidden md:table-cell">Total Amount</TableHead>
                                <TableHead>
                                    <span className="hidden md:table-cell">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finaldata?.map((invoice: Invoice) => (
                                //@ts-ignore
                                <TableRow key={invoice._id}>
                                    <TableCell className="font-medium">
                                        {getTotalQuantity(invoice.products)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            onClick={() => togglePaymentStatus(invoice)}
                                            disabled={isLoadingUpdate}
                                        >
                                            {invoice.paid ? "Paid" : "Unpaid"}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(invoice.updatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">{invoice.totalAmount}</TableCell>
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
                                                {/* <DropdownMenuItem
                                                    onClick={() => handleUpdateCategory(category)}
                                                >
                                                    Edit
                                                </DropdownMenuItem> */}
                                                <DropdownMenuItem
                                                    //@ts-ignore
                                                    onClick={() => onDeleteCategory(invoice._id)}
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

export default ProductPage;
