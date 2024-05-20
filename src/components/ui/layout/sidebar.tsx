import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdLaptopChromebook, MdLogout, MdAreaChart, MdMenuOpen, MdCardGiftcard, MdPayments } from "react-icons/md";

const Sidebar: React.FC = () => {
    const [activeLink, setActiveLink] = useState<string>("/dashboard");
    const router = useRouter();

    const handleLinkClick = (path: string) => {
        setActiveLink(path);
        router.push(path);
    };

    const linkClasses = (path: string) =>
        `px-2 py-2 gap-2 font-semibold flex flex-col items-center cursor-pointer justify-center ${activeLink === path ? "bg-gray-700 w-24 mx-auto rounded-lg text-yellow-400" : "text-white"}`;

    useEffect(() => {
        //@ts-ignore
        setActiveLink(router.pathname);
        //@ts-ignore
    }, [router.pathname]);

    return (
        <div className="bg-slate-800 w-32 h-screen flex flex-col items-center">
            <div className="p-2 mb-4">
                <MdLaptopChromebook color="white" size={70} />
            </div>
            <div className="flex flex-col space-y-2 w-full">
                <div className={linkClasses("/dashboard")} onClick={() => handleLinkClick("/dashboard")}>
                    <MdAreaChart size={30} />
                    Dashboard
                </div>
                <div className={linkClasses("/categories")} onClick={() => handleLinkClick("/categories")}>
                    <MdMenuOpen size={30} />
                    Categories
                </div>
                <div className={linkClasses("/products")} onClick={() => handleLinkClick("/products")}>
                    <MdCardGiftcard size={30} />
                    Products
                </div>
                <div className={linkClasses("/invoices")} onClick={() => handleLinkClick("/invoices")}>
                    <MdPayments size={30} />
                    Invoices
                </div>
            </div>
            <div className="flex-grow"></div>
            <div className={linkClasses("/login")} onClick={() => handleLinkClick("/login")}>
                <MdLogout size={30} />
                Logout
            </div>
        </div>
    );
};

export default Sidebar;
