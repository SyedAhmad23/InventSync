import React, { useEffect, useState } from "react";
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
import { RootState } from "@/app/store/store";
import { Category, Product } from "@/types";
import NoImg from "@/assets/images/no-img.png";
import { CustomSelect } from "../ui/custom-select";
import { useGetAllCategoriesQuery } from "@/feature/category/categoryApi";
import { useGetAllSuppliersQuery } from "@/feature/supplier/supplierApi";
import { unitCodesData } from "@/app/data/unitcode";

const UpdateProduct: React.FC = () => {
    const modalState = useSelector((state: RootState) => state.modal);
    const fileRef = React.useRef<HTMLInputElement>(null);
    const product = modalState.data.product as Product;
    const dispatch = useDispatch();
    const { data, error, isLoading } = useGetAllCategoriesQuery();
    //@ts-ignore
    const finaldata = data?.categories;
    const { data: supplier } = useGetAllSuppliersQuery();
    const finalsupplier = supplier;
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
        if (product) {
            reset({
                name: product?.name,
                description: product?.description,
                quantity: product?.quantity,
                category: product?.category?._id || undefined,
                image: product?.image,
                buyingPrice: product?.buyingPrice,
                sellPrice: product?.sellPrice,
                suppliers: product?.suppliers?._id?.toString() || undefined,
                unitCode: product?.unitCode,
                sku: product?.sku,
            });
            setImageInfo({ file: null, src: product?.image || "" });
        }
    }, [product, reset]);

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
        const { name, description, category, quantity, image, buyingPrice, sellPrice, suppliers, unitCode, sku } = data;
        let jsonData = {
            name,
            description,
            category,
            quantity: Number(quantity),
            buyingPrice: Number(buyingPrice),
            sellPrice: Number(sellPrice),
            suppliers,
            unitCode,
            sku,
        };

        if (imageInfo.file) {
            const imageUrl = URL.createObjectURL(imageInfo.file);
            jsonData = {
                ...jsonData,
                //@ts-ignore
                image: imageUrl,
            };
        }

        try {
            //@ts-ignore
            await updateProduct({ id: product._id, formData: jsonData }).unwrap();
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
                            <div
                                className="bg-slate-100 aspect-video relative rounded-lg h-60 overflow-hidden"
                                onClick={() => fileRef.current?.click()}
                            >
                                <input ref={fileRef} hidden type="file" accept="image/*" onChange={handleImageChange} />
                                <Image
                                    src={imageInfo?.src || NoImg}
                                    alt="picture"
                                    fill
                                    className={imageInfo?.src ? "object-cover" : "object-contain"}
                                />
                            </div>
                            <div className="mt-4">
                                <Button className="w-full" onClick={(e) => {
                                    e.preventDefault();
                                    fileRef.current?.click();
                                }}>
                                    Add Image
                                </Button>
                            </div>
                        </div>
                    </div>
                    {errors.image && (
                        <span className="text-red-600 text-sm font-medium">{errors.image?.message}</span>
                    )}
                    <div className="mt-6">
                        <p className="text-base font-medium">Product Information</p>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-3">
                            <Input {...register("name")} id="name" label="Product Name" placeholder="Enter name" required={true}
                                error={errors.name?.message} />
                            <Input {...register("buyingPrice")} id="buyingPrice" type="number" label="Buying Price" placeholder="What's the buying price?" required={true}
                                error={errors.buyingPrice?.message} />
                            <Input {...register("sellPrice")} id="sellPrice" type="number" label="Selling Price" placeholder="What's the Selling price?" required={true}
                                error={errors.sellPrice?.message} />
                            <div>
                                <h4 className="text-gray-700 mb-2 font-semibold">Category:</h4>
                                <CustomSelect
                                    items={finaldata?.map((category: Category) => category.name) || []}
                                    placeholder="Select category"
                                    defaultValue={product?.category?.name || ""}
                                    onSelect={(selectedCategory) => {
                                        const category = finaldata?.find((cat: Category) => cat.name === selectedCategory);
                                        if (category) {
                                            console.log("Selected Category:", category);
                                            setValue("category", category._id);
                                        }
                                    }}
                                />
                                {errors.category && (
                                    <span className="text-red-600 text-sm font-medium">
                                        {errors.category.message}
                                    </span>
                                )}
                            </div>
                            <Input {...register("quantity")} id="quantity" type="number" label="Quantity" placeholder="How many product quantity?" required={true}
                                error={errors.quantity?.message} />
                            <div>
                                <h4 className="text-gray-700 mb-2 font-semibold">Supplier:</h4>
                                <CustomSelect
                                    items={finalsupplier?.map((supplier) => supplier.name) || []}
                                    placeholder="Select Supplier"
                                    defaultValue={product?.suppliers?.name}
                                    onSelect={(selectedSupplier) => {
                                        const supplier = finalsupplier?.find((sup) => sup.name === selectedSupplier);
                                        if (supplier) {
                                            console.log("Selected Supplier:", supplier);
                                            setValue("suppliers", supplier._id);
                                        }
                                    }}
                                />
                                {errors.suppliers && (
                                    <span className="text-red-600 text-sm font-medium">
                                        {errors.suppliers.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-gray-700 mb-2 font-semibold">Unit Code:</h4>
                                <CustomSelect
                                    items={unitCodesData.map(unit => unit.name)}
                                    placeholder="Select unit code"
                                    defaultValue={product?.unitCode}
                                    onSelect={(selectedUnitCode) => {
                                        const unitCode = unitCodesData.find(unit => unit.name === selectedUnitCode)?.code;
                                        if (unitCode) {
                                            console.log("Selected Unit Code:", unitCode);
                                            setValue("unitCode", unitCode);
                                        }
                                    }}
                                />
                                {errors.unitCode && (
                                    <span className="text-red-600 text-sm font-medium">
                                        {errors.unitCode.message}
                                    </span>
                                )}
                            </div>
                            <Input {...register("sku")} id="sku" label="SKU" placeholder="Enter SKU" required={true}
                                error={errors.sku?.message} />
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
                            Update Product
                        </Button>
                    </div>
                </ModalFooter>
            </form>
        </div>
    );
};

export default UpdateProduct;
