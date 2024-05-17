"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import invoice from "@/assets/icons/invoice.png"
import dashbord from "@/assets/icons/dashboard.png"
import category from "@/assets/icons/category.png"
import product from "@/assets/icons/product.png"
import logoutImg from "@/assets/icons/logout.png"
import Logo from "@/assets/icons/logo.png";
const Sidebar = () => {

    return (
        <div className="bg-blue-200 w-32 h-screen items-center flex flex-col">
            <div className="p-2 mb-4">
                <Image src={Logo} alt="logo" width={50} height={50} />
            </div>
            <div className="flex flex-col space-y-1">
                <Link href={"/"}
                    className={`px-2 py-2 gap-1 text-gray-950 font-semibold flex flex-col items-center justify-center}`}
                >
                    <Image src={dashbord} alt="dashboard" width={30} height={30} />
                    Dashboard
                </Link>
                <Link href={"/"}
                    className={`px-2 py-2 gap-1 text-gray-950 font-semibold flex flex-col items-center justify-center}`}
                >
                    <Image src={category} alt="category" width={30} height={30} />
                    Categories
                </Link>
                <Link href={"/"}
                    className={`px-2 py-2 gap-1 text-gray-950 font-semibold flex flex-col items-center justify-center}`}
                >
                    <Image src={product} alt="product" width={30} height={30} />
                    Products
                </Link>
                <Link href={"/"}

                    className={`px-2 py-2 gap-1 text-gray-950 font-semibold flex flex-col items-center justify-center}`}
                >
                    <Image src={invoice} alt="invoice" width={20} height={20} />
                    Invoices
                </Link>
            </div>
            <div className="flex-grow"></div>
            <div className="p-2">
                <Link href={"/login"}
                    className={`px-2 py-2 gap-1 text-gray-950 font-semibold flex flex-col items-center justify-center}`}
                >
                    <Image src={logoutImg} alt="logout" width={30} height={30} />
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
