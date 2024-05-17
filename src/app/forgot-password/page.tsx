"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";


interface Props { }

type FormInputs = {
    email: string;
};

function ForgotPassword({ }: Props) {
    const { register, handleSubmit } = useForm<FormInputs>();

    const onSubmitHandler = () => {
        console.log("forgot");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
            <h1 className="mb-8 text-2xl font-bold">
                Reset Password
            </h1>
            <form
                onSubmit={handleSubmit(onSubmitHandler)}
                className="flex flex-col gap-2 w-full md:w-80"
            >
                <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    className=" !my-0.5"
                />
                <Button className="w-full">
                    Reset Password
                </Button>
            </form>
            <Link
                className="cursor-pointer mt-2 underline"
                href={ROUTES.login}
            >
                Back to login
            </Link>
        </div>
    );
}

export default ForgotPassword;