import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

interface CustomCardProps {
    logo?: StaticImageData | React.ComponentType<any>;
    text: string;
    number: number;
    className?: string;
}

const DisplayCard: React.FC<CustomCardProps> = ({ logo, text, number, className }) => {
    return (
        <Card className={`pt-4 ${className}`}>
            <CardContent className=" flex ">
                <div>
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
                </div>
                <div>
                    <CardTitle>
                        {text}
                    </CardTitle>
                    <p className="text-lg font-semibold text-gray-600">{number}</p>
                </div>
                </CardContent>
        </Card>
    );
};

export default DisplayCard;
