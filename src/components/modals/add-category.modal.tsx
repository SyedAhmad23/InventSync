import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ModalContent, ModalFooter } from "../ui/modal";
import { closeModal } from "@/feature/modal/modalSlice";
import { Input } from "@/components/ui/input";
import { CategoryFormSchema, CategoryFormValues } from "@/schema/category-form.schema";
import { useAddCategoryMutation } from "@/feature/category/categoryApi";

const AddCategory = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: yupResolver(CategoryFormSchema),
  });
  const [addCategory, { isLoading: isLoadingCreate }] = useAddCategoryMutation();

  const onSubmit = (data: CategoryFormValues) => {
    const { name, description } = data;
    const jsonData = { name, description };
    //@ts-ignore
    addCategory(jsonData)
      .then(() => {
        reset();
        dispatch(closeModal());
        toast.success("Category added successfully");
      })
      .catch((error) => {
        toast.error("Failed to add Category");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <div className="mt-6">
            <p className="text-base font-medium">Category Information</p>
            <div className="grid gap-y-4 mt-3">
              <Input {...register("name")} id="name" label="Category Name" placeholder="Enter name" />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            </div>
            <div className="mt-2">
              <label className="block text-gray-700 font-semibold">Description:</label>
              <textarea
                placeholder="Description"
                {...register("description")}
                id="description"
                name="description"
                className="w-full h-28 rounded-lg bg-white px-4 mt-2 border py-2 resize-none focus:outline-none"
              />
              {errors.description && <p className="text-red-600">{errors.description.message}</p>}
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <div className="flex justify-end items-end gap-3">
            <Button onClick={() => dispatch(closeModal())} className="px-9" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoadingCreate}>
              {isLoadingCreate ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </div>
  );
};

export default AddCategory;
