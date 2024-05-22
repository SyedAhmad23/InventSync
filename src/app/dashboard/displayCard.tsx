import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

interface CustomCardProps {
    logo?: StaticImageData | React.ComponentType<any>;
    text: string;
    number: number;
    className?: string;
}

const DisplayCard: React.FC<CustomCardProps> = ({ logo, text, number, className }) => {
    return (
        <Card className={`flex items-center ${className}`}>
            {logo && typeof logo === 'object' && (
                <Image
                    src={logo}
                    alt="logo"
                    width={48}
                    height={48}
                    className="mx-4"
                />
            )}
            {logo && typeof logo === 'function' && (
                <div className="mx-4">
                    {React.createElement(logo, { size: 48 })}
                </div>
            )}
            <div className="items-center mt-4">
                <CardContent>
                    <h2 className="text-xl font-semibold">
                        {text}
                    </h2>
                    <p>{number}</p>
                </CardContent>
            </div>
        </Card>
    );
};

export default DisplayCard;
