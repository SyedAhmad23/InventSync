import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModalContent, ModalFooter } from "../ui/modal";
// import upload from "@/assets/images/image.svg";
import { ProductFormSchema, ProductFormValues } from "@/schema/product-form.schema";
import { closeModal } from "@/feature/modal/modalSlice";
import { useAddProductMutation } from "@/feature/product/productApi";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import Select from "react-select";
import { BiLeftTopArrowCircle } from "react-icons/bi";

const AddProduct = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProductFormValues>({
        resolver: yupResolver(ProductFormSchema),
    });
    const [addProduct, { isLoading: isLoadingCreate }] = useAddProductMutation();
    const [imageInfo, setImageInfo] = useState({ file: null as File | null, src: "" });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const src = URL.createObjectURL(file);
            setImageInfo({ file, src });
            setValue("image", src);
        }
    };


    const onSubmit = async (data: ProductFormValues) => {
        const { name, description, price, category, quantity, image } = data;
        let jsonData = {
            name,
            description,
            price: Number(price),
            category: Number(category),
            quantity: Number(quantity),
        };
        if (imageInfo.file) {
            const imageUrl = URL.createObjectURL(imageInfo.file);
            jsonData = {
                ...jsonData,
                //@ts-ignore
                image: imageUrl
            };
        }
        try {
            //@ts-ignore
            await addProduct(jsonData).unwrap();
            reset();
            setImageInfo({ file: null, src: "" });
            dispatch(closeModal());
            toast.success("Product added successfully");
        } catch (error) {
            toast.error("Failed to add product");
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <div className="flex justify-center">
                        <div>
                            <div className="bg-slate-100 aspect-video relative rounded-lg h-60 overflow-hidden" onClick={() => fileRef.current?.click()}>
                                <input ref={fileRef} hidden type="file" accept="image/*" onChange={handleImageChange} />
                                <Image src={imageInfo?.src} alt="picture" fill className={imageInfo?.src ? "object-cover" : "object-contain"} />
                            </div>
                            <div className="mt-4">
                                <Button className="w-full" onClick={(e) => { e.preventDefault(); fileRef.current?.click(); }}>
                                    Add Image
                                </Button>
                            </div>
                        </div>
                    </div>
                    {errors.image && <span className="text-red-600 text-sm font-medium">{errors.image?.message}</span>}
                    <div className="mt-6">
                        <p className="text-base font-medium">Product Information</p>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-3">
                            <Input {...register("name")} id="name" label="Product Name" placeholder="Enter name" />
                            <Input {...register("price")} id="price" type="number" label="Price" placeholder="What's the price?" />
                            <div>
                                {/* <p className="text-charcoalGray mb-2">Category</p> */}
                                {/* <Select
                  onChange={(selectedOptions) => {
                    setValue("category_id", Number(selectedOptions?.value));
                  }}
                  options={categoriesData?.data?.map((category: Category) => ({
                    label: category.name,
                    value: category.id.toString(),
                  }))}
                />
                {errors.category_id?.message && (
                  <span className="text-red-600 text-sm font-medium">
                    {errors.category_id.message}
                  </span>
                )} */}
                                <Input {...register("category")} id="category" label="Category" placeholder="Enter product category" />
                            </div>
                            <Input {...register("quantity")} id="quantity" min={1} type="number" label="Quantity" placeholder="How many product quanity?" />

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
                        <Button onClick={() => dispatch(closeModal())} className="px-9" type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoadingCreate} >
                            Add Product
                        </Button>
                    </div>
                </ModalFooter>
            </form>
        </div>
    );
};

export default AddProduct;
