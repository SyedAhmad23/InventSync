"use client";
import React, { useState } from "react";
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

import {
  useDeleteCategoryMutation,
  useDownloadCategoriesQuery,
  useGetAllCategoriesQuery,
  useImportCategoriesMutation,
} from "@/feature/category/categoryApi";
import { Input } from "@/components/ui/input";
import { File } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { refetch: refetchDownload } = useDownloadCategoriesQuery();
  const [importCategories] = useImportCategoriesMutation();

  const [file, setFile] = useState<File | null>(null);
  // const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // // Toggle function to switch between expanded and collapsed states
  // const toggleDescription = (index: number) => {
  //   setIsDescriptionExpanded(!isDescriptionExpanded);
  // };

  const [expandedStates, setExpandedStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDescription = (categoryId: string) => {
    setExpandedStates((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const dispatch = useDispatch();
  //@ts-ignore
  const finaldata = data?.categories;
  console.log(finaldata);
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
    dispatch(
      openModal({
        view: "UPDATE_CATEGORY",
        data: { category: selectedCategory },
      })
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  const handleImportCategories = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await importCategories(formData).unwrap();
        toast.success("Products imported successfully");
        setFile(null);
      } catch (error) {
        toast.error("Failed to import products");
      }
    } else {
      toast.error("No file selected");
    }
  };
  const handleExportCategories = () => {
    refetchDownload();
  };
  return (
    <Layout>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Input
            type="file"
            onChange={handleFileChange}
            className="h-8 text-white bg-gray-700"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 bg-gray-700 text-white gap-1"
            onClick={handleImportCategories}
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap ">
              Import
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 bg-gray-700 text-white gap-1"
            onClick={handleExportCategories}
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap ">
              Export
            </span>
          </Button>
          <Button
            size="sm"
            className="h-8 bg-gray-700 text-white gap-1"
            onClick={handleAddCategory}
          >
            <MdAdd className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap ">
              Add Categories
            </span>
          </Button>
        </div>
      </div>

      <Card className=" mt-10 ">
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
                <TableHead className="text-black">Name</TableHead>
                <TableHead className="text-black">CreatedAt</TableHead>
                <TableHead className="text-black">UpdatedAt</TableHead>
                <TableHead className="text-black">Description</TableHead>
                <TableHead className="text-black">
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
                        <Skeleton className="h-6 w-full rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-10 rounded-sm" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            ) : (
              <TableBody>
                {finaldata?.map((category: Category, index: number) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`flex flex-col items-start ${
                        expandedStates[category._id] ? "" : "line-clamp-1"
                      } overflow-hidden`}
                    >
                      {expandedStates[category._id]
                        ? category.description
                        : `${category.description.substring(0, 70)}`}
                      {category.description.length > 70 && (
                        <button
                          className="font-medium text-xs uppercase"
                          onClick={() => toggleDescription(category._id)}
                        >
                          {expandedStates[category._id]
                            ? "View less"
                            : "......View more"}
                        </button>
                      )}
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
                            onClick={() => handleUpdateCategory(category)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
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
            )}
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CategoryPage;
