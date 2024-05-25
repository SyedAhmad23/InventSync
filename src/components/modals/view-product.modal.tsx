import React from "react";
import { useSelector } from "react-redux";
import { ModalContent, ModalFooter } from "../ui/modal";
import { RootState } from "@/app/store/store";
import { Product } from "@/types";
import { useGetAllCategoriesQuery } from "@/feature/category/categoryApi";
import { useGetAllSuppliersQuery } from "@/feature/supplier/supplierApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NoImg from "@/assets/images/no-img.png";

const ViewProduct: React.FC = () => {
    const modalState = useSelector((state: RootState) => state.modal);
    const product = modalState.data.product as Product;

    return (
        <div>
            <form>
                <ModalContent>
                    <div className="flex justify-center">
                        <div>
                            <div className="bg-slate-100 aspect-video relative rounded-lg h-60 overflow-hidden">
                                <img src={product.image || NoImg} alt="Product" className="object-cover w-full h-full" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-base font-medium">Product Information</p>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-3">
                            <Input
                                id="name"
                                label="Product Name"
                                value={product.name}
                                readOnly
                            />
                            <Input
                                id="buyingPrice"
                                type="number"
                                label="Buying Price"
                                value={product.buyingPrice.toString()}
                                readOnly
                            />
                            <Input
                                id="sellPrice"
                                type="number"
                                label="Selling Price"
                                value={product.sellPrice.toString()}
                                readOnly
                            />
                            <Input
                                id="quantity"
                                type="number"
                                label="Quantity"
                                value={product.quantity.toString()}
                                readOnly
                            />
                            <Input
                                id="category"
                                label="Category"
                                value={product.category?.name || ""}
                                readOnly
                            />
                            <Input
                                id="supplier"
                                label="Supplier"
                                value={product.suppliers?.name || ""}
                                readOnly
                            />
                            <Input
                                id="unitCode"
                                label="Unit Code"
                                value={product.unitCode || ""}
                                readOnly
                            />
                            <Input
                                id="sku"
                                label="SKU"
                                value={product.sku}
                                readOnly
                            />
                        </div>
                        <div className="mt-2">
                            <label className="text-charcoalGray">Description</label>
                            <textarea
                                value={product.description}
                                className="w-full h-28 rounded-lg bg-white px-4 mt-2 border py-2 resize-none focus:outline-none"
                                readOnly
                            />
                        </div>
                    </div>
                </ModalContent>

            </form>
        </div>
    );
};

export default ViewProduct;
