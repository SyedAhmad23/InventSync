"use client";
import React from "react";
import Layout from "@/components/layout/layout";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Category } from "@/types";
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

import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from "@/feature/category/categoryApi";

const CategoryPage: React.FC = () => {
    const { data, error, isLoading } = useGetAllCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const dispatch = useDispatch();
    //@ts-ignore
    const finaldata = data?.categories;
    console.log(finaldata);
    if (isLoading) return <Layout>Loading...</Layout>;
    if (error) return <Layout>Error...</Layout>;

    const handleAddCategory = () => {
        dispatch(
            openModal({ view: "ADD_CATEGORY", data: { title: "Add Category" } })
        );
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory({ id }).unwrap();
            toast.success("Category deleted successfully");
            dispatch(closeModal());
        } catch (error) {
            toast.error("Failed to delete Category");
        }
    };

    const onDeleteCategory = (id: string) => {
        dispatch(
            openModal({
                view: "DELETE_PERMISSION",
                data: {
                    title: "Delete Category",
                    id,
                    onConfirm: () => handleDeleteCategory(id),
                },
            })
        );
    };

    const handleUpdateCategory = (selectedCategory: Category) => {
        dispatch(openModal({ view: "UPDATE_CATEGORY", data: { category: selectedCategory } }));
    };

    return (
        <Layout>
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddCategory}>
                        <MdAdd className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Categories
                        </span>
                    </Button>
                </div>
            </div>

            <Card className=" mt-10">
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                        Manage your Categories and view their sales performance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">CreatedAt</TableHead>
                                <TableHead className="hidden md:table-cell">UpdatedAt</TableHead>
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                                <TableHead>
                                    <span className="hidden md:table-cell">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finaldata?.map((category: Category) => (
                                <TableRow key={category._id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(category.updatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">{category.description}</TableCell>
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
                                                    onClick={() => handleUpdateCategory(category)}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    //@ts-ignore
                                                    onClick={() => onDeleteCategory(category._id)}
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
