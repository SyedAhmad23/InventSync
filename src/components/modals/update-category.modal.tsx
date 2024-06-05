import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ModalContent, ModalFooter } from "../ui/modal";
import { closeModal } from "@/feature/modal/modalSlice";
import { Input } from "@/components/ui/input";
import { RootState } from "@/app/store/store";
import { Category } from "@/types";
import { CategoryFormSchema, CategoryFormValues } from "@/schema/category-form.schema";
import { useUpdateCategoryMutation } from "@/feature/category/categoryApi";

const UpdateCategory: React.FC = () => {
    const modalState = useSelector((state: RootState) => state.modal);
    const category = modalState.data.category as Category;
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CategoryFormValues>({
        resolver: yupResolver(CategoryFormSchema),
    });
    const [updateCategory, { isLoading: isLoadingUpdate }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (category) {
            reset({
                name: category?.name,
                description: category?.description,
            });
            console.log(category.name, "name")
            console.log(category.description, "description")
        }
    }, [category, reset]);


    const onSubmit = async (data: CategoryFormValues) => {
        const { name, description } = data;
        let jsonData = {
            name,
            description,
        };
        try {
            //@ts-ignore
            await updateCategory({ id: category._id, formData: jsonData }).unwrap();
            reset();
            dispatch(closeModal());
            toast.success("Category updated successfully");
        } catch (error) {
            toast.error("Failed to update Category");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <div className="mt-6">
                        <p className="text-base font-medium">Category Information</p>
                        <div className="grid gap-y-4 mt-3">
                            <Input {...register("name")} id="name" label="Category Name" placeholder="Enter name" required={true}
                                error={errors.name?.message} />
                        </div>
                        <div className="mt-2">
                            <label className="text-charcoalGray">Description</label>
                            <textarea
                                placeholder="Description"
                                {...register("description")}
                                id="description"
                                name="description"
                                className="w-full h-28 rounded-lg bg-white px-4 mt-2 border py-2 resize-none focus:outline-none"
                            />
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <div className="flex justify-end items-end gap-3">
                        <Button onClick={() => dispatch(closeModal())}
                            variant="secondary"
                            type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoadingUpdate}>
                            Update Category
                        </Button>
                    </div>
                </ModalFooter>
            </form>
        </div>
    );
};

export default UpdateCategory;
