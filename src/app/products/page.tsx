"use client";
import React from "react";
import Layout from "@/components/layout/layout";
import { useGetAllProductsQuery, useDeleteProductMutation, useDownloadProductsQuery } from "@/feature/product/productApi";
import { MdDelete, MdEdit, MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Product } from "@/types";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/feature/modal/modalSlice";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NoImg from "@/assets/images/no-img.png";
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
import { File } from "lucide-react";
import Image from "next/image";

const ProductPage: React.FC = () => {
    const { data, error, isLoading } = useGetAllProductsQuery();
    const { data: downloadData, error: errorDownload, isLoading: isLoadingDownload, refetch: refetchDownload } = useDownloadProductsQuery();

    const [deleteProduct] = useDeleteProductMutation();
    const dispatch = useDispatch();
    //@ts-ignore
    const finaldata = data?.products;
    console.log(finaldata);
    if (isLoading) return <Layout>Loading...</Layout>;
    if (error) return <Layout>Error...</Layout>;

    const handleAddProduct = () => {
        console.log("Add Product button clicked");
        dispatch(
            openModal({ view: "ADD_PRODUCT", data: { title: "Add Product" } })
        );
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            await deleteProduct({ id }).unwrap();
            toast.success("Product deleted successfully");
            dispatch(closeModal());
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const onDeleteProduct = (id: string) => {
        dispatch(
            openModal({
                view: "DELETE_PERMISSION",
                data: {
                    title: "Delete Product",
                    id,
                    onConfirm: () => handleDeleteProduct(id),
                },
            })
        );
    };

    const handleUpdateProduct = (selectedProduct: Product) => {
        dispatch(openModal({ view: "UPDATE_PRODUCT", data: { product: selectedProduct } }));
    };

    const handleExportProducts = () => {
        refetchDownload();
    };

    return (
        <Layout>
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleExportProducts}>
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Export
                        </span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddProduct}>
                        <MdAdd className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </div>
            </div>

            <Card className=" mt-10">
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        Manage your products and view their sales performance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="hidden md:table-cell">Price</TableHead>
                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                                <TableHead>
                                    <span className="hidden md:table-cell">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finaldata?.map((product: Product) => (
                                //@ts-ignore
                                <TableRow key={product._id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <img
                                            alt="Product image"
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={product.image || NoImg}
                                            width="64"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.quantity}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">${product.price}</TableCell>
                                    <TableCell className="hidden md:table-cell">{product.category?.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{product.description}</TableCell>
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
                                                    onClick={() => handleUpdateProduct(product)}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    //@ts-ignore
                                                    onClick={() => onDeleteProduct(product._id)}
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
