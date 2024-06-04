import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModalContent, ModalFooter } from "../ui/modal";
import { ProductFormSchema, ProductFormValues } from "@/schema/product-form.schema";
import { closeModal } from "@/feature/modal/modalSlice";
import { useAddProductMutation } from "@/feature/product/productApi";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { unitCodesData } from "@/app/data/unitcode";
import NoImg from "@/assets/images/no-img.png";
import { useGetAllCategoriesQuery } from "@/feature/category/categoryApi";
import { useGetAllSuppliersQuery } from "@/feature/supplier/supplierApi";
import { Category } from "@/types";

const AddProduct = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProductFormValues>({
        resolver: yupResolver(ProductFormSchema),
    });
    const { data, error, isLoading } = useGetAllCategoriesQuery();
    //@ts-ignore
    const finaldata = data?.categories;
    const { data: supplier } = useGetAllSuppliersQuery();
    const finalsupplier = supplier;

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
        const { name, description, sellPrice, category, quantity, buyingPrice, suppliers, unitCode, sku } = data;
        let jsonData = {
            name,
            description,
            sellPrice: Number(sellPrice),
            buyingPrice: Number(buyingPrice),
            category,
            suppliers,
            unitCode,
            quantity: Number(quantity),
            sku,
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
                                <Image src={imageInfo?.src || NoImg} alt="picture" fill className={imageInfo?.src ? "object-cover" : "object-contain"} />
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
                            <Input {...register("name")} id="name" label="Product Name" placeholder="Enter name"
                                required={true}
                                error={errors.name?.message} />
                            <Input {...register("buyingPrice")} id="buyingPrice" type="number" label="Buying Price" placeholder="What's the buying price?" required={true} error={errors.buyingPrice?.message} />
                            <Input {...register("sellPrice")} id="sellPrice" type="number" label="Selling Price" placeholder="What's the Selling price?" required={true} error={errors.sellPrice?.message} />
                            <div>
                                <h4 className="text-gray-700 mb-2 font-semibold">Category</h4>
                                <CustomSelect
                                    items={finaldata?.map((category: Category) => category.name) || []}
                                    placeholder="Select category"
                                    onSelect={(selectedCategory) => {
                                        const category = finaldata?.find((cat: Category) => cat.name === selectedCategory);
                                        if (category) {
                                            console.log("Selected Category:", category);
                                            setValue("category", category._id);
                                        }
                                    }}
                                />
                                {errors.category && (
                                    <span className="text-red-600 text-sm">
                                        {errors.category.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-gray-700 mb-2 font-semibold">Supplier</h4>
                                <CustomSelect
                                    items={finalsupplier?.map((supplier) => supplier.name) || []}
                                    placeholder="Select Supplier"
                                    onSelect={(selectedSupplier) => {
                                        const supplier = finalsupplier?.find((sup) => sup.name === selectedSupplier);
                                        if (supplier) {
                                            console.log("Selected Supplier:", supplier);
                                            setValue("suppliers", supplier._id);
                                        }
                                    }}
                                />
                                {errors.suppliers && (
                                    <span className="text-red-600 text-sm">
                                        {errors.suppliers.message}
                                    </span>
                                )}
                            </div>

                            <Input {...register("quantity")} id="quantity" min={1} type="number" label="Quantity" placeholder="How many product quantity?" required={true}
                                error={errors.quantity?.message} />
                            <div>
                                <h4 className="text-gray-700 mb-2 font-semibold">Unit Code</h4>
                                <CustomSelect
                                    items={unitCodesData.map(unit => unit.name)}
                                    placeholder="Select unit code"
                                    onSelect={(selectedUnitCode) => {
                                        const unitCode = unitCodesData.find(unit => unit.name === selectedUnitCode)?.code;
                                        if (unitCode) {
                                            console.log("Selected Unit Code:", unitCode);
                                            setValue("unitCode", unitCode);
                                        }
                                    }}
                                />
                                {errors.unitCode && (
                                    <span className="text-red-600 text-sm">
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
                        <Button onClick={() => dispatch(closeModal())} className="bg-slate-300 px-9 text-black hover:bg-primary hover:text-white"
                            type="button">
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
