import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

interface CustomCardProps {
    logo?: StaticImageData;
    text: string;
    number: number;
    className?: string;
}

const DisplayCard: React.FC<CustomCardProps> = ({ logo, text, number, className }) => {
    return (
        <Card className={` flex items-center ${className}`}>
            {logo && (
                <Image
                    src={logo}
                    alt="logo"
                    width={48}
                    height={48}
                    className="mx-4"
                />
            )}
            <div className="items-center mt-4">
                <CardContent>
                    <h2 className="text-xl font-semibold">
                        {text}
                    </h2>
                    <p >{number}</p>
                </CardContent>
            </div>
        </Card>
    );
};

export default DisplayCard;
