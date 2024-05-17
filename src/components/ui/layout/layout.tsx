import React from "react";
import Sidebar from "./sidebar";

interface Props {
    children?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div className="md:h-screen md:flex justify-between">
            <Sidebar />
            <div className="grow overflow-y-auto">
                <div className="container mx-auto pt-10 pb-24 px-8">{children}</div>
            </div>
        </div>
    );
};

export default Layout;