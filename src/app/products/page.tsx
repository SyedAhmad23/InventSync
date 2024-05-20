"use client";
import React from "react";
import Layout from "@/components/ui/layout/layout";
import { useGetAllProductsQuery } from "@/feature/product/productApi";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { Product } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";

const ProductPage: React.FC = () => {
    const { data, error, isLoading } = useGetAllProductsQuery();

    // React.useEffect(() => {
    //     data({ name: "", description: "", image: "", price: "" });
    // }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        const errorMessage = (error as SerializedError).message;
        return <div>Error: {errorMessage}</div>;
    }
    return (
        <Layout>
            <h2>Products</h2>
            <div className="grid grid-cols-3 gap-4">
                {data?.map((product: Product) => (
                    <div key={product.id} className="bg-gray-100 p-4 rounded-lg">
                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-gray-500">${product.price}</p>
                        <div className="flex justify-end mt-2">
                            <MdRemoveRedEye className="cursor-pointer mr-2 text-blue-500" />
                            <MdEdit className="cursor-pointer mr-2 text-green-500" />
                            <MdDelete className="cursor-pointer text-red-500" />
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default ProductPage;
