import React from "react";
import Image, { StaticImageData } from "next/image";

interface CustomCardProps {
    logo?: StaticImageData;
    text: string;
    number: number;
    className?: string;
}

const DisplayCard: React.FC<CustomCardProps> = ({ logo, text, number, className }) => {
    return (
        <div className={` bg-gray-200 rounded-lg shadow p-4 flex items-center ${className}`}>
            <div className="mr-4">
                {logo && <Image src={logo} alt="logo" width={48} height={48} />}
            </div>
            <div>
                <p className="text-lg font-semibold">{text}</p>
                <p className="text-gray-500">{number}</p>
            </div>
        </div>
    );
};

export default DisplayCard;
