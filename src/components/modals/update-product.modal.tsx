import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModalContent, ModalFooter } from "../ui/modal";
import { ProductFormSchema, ProductFormValues } from "@/schema/product-form.schema";
import { closeModal } from "@/feature/modal/modalSlice";
import { useUpdateProductMutation } from "@/feature/product/productApi";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { BiLeftTopArrowCircle } from "react-icons/bi";
import { RootState } from "@/app/store/store";
import { Product } from "@/types";


const UpdateProduct = ({ }) => {
    const modalState = useSelector((state: RootState) => state.modal);
    const fileRef = React.useRef<HTMLInputElement>(null);
    const product = modalState.data.product as Product;
    console.log("Modal State data product:", product?._id);

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ProductFormValues>({
        resolver: yupResolver(ProductFormSchema),
    });
    const [updateProduct, { isLoading: isLoadingUpdate }] = useUpdateProductMutation();
    useEffect(() => {
        console.log("Selected Product", modalState);
        reset({
            name: product?.name,
            price: product?.price,
            description: product?.description,
            quantity: product?.quantity,
            category: product?.category?.id || undefined,
            image: product?.image,

        });
        console.log("Resetting form with producttt:", product);
        console.log("Default Name:", product?.name);
        console.log("Default Price:", product?.price);
        console.log("Default Description:", product?.description);
        console.log("Default Quantity:", product?.quantity);
        console.log("Default Category:", product?.category?.id);
        console.log("Default Image:", product?.image);

    }, [product, reset]);
    console.log("Resetting form with product:", product);

    const [imageInfo, setImageInfo] = useState({
        file: null as File | null,
        src: product?.image || "",
    });

    useEffect(() => {
        register("image");
        setValue("image", imageInfo?.src);
    }, [register, imageInfo?.src, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (fileRef.current && e.target.files) {
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
                // @ts-ignore
                image: imageUrl
            };
        }
        try {
            //@ts-ignore
            await updateProduct({ id: product._id, data: jsonData }).unwrap();
            reset();
            setImageInfo({ file: null, src: "" });
            dispatch(closeModal());
            toast.success("Product updated successfully");
        } catch (error) {
            toast.error("Failed to update product");
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
                                <Input {...register("category")} id="category" label="Category" placeholder="Enter product category" />
                            </div>
                            <Input {...register("quantity")} id="quantity" type="number" label="Quantity" placeholder="How many product quanity?" />

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
                        <Button type="submit" loading={isLoadingUpdate}>
                            Update Product
                        </Button>
                    </div>
                </ModalFooter>
            </form>
        </div>
    );
};

export default UpdateProduct;
