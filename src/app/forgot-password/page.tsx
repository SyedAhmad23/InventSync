"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useForgotPasswordMutation } from "@/feature/auth/authApi";
import { toast } from "react-toastify";

interface Props { }

type FormInputs = {
    email: string;
};

function ForgotPassword({ }: Props) {
    const { register, handleSubmit } = useForm<FormInputs>();
    const router = useRouter();
    const [forgotPassword] = useForgotPasswordMutation();

    const onSubmitHandler = async (data: FormInputs) => {
        try {
            await forgotPassword(data).unwrap();
            // router.push(ROUTES.resetPassword);
            toast.success("Password reset link sent to your email");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
            <h1 className="mb-8 text-2xl font-bold">Reset Password</h1>
            <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-2 w-full md:w-80">
                <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    {...register("email", { required: true })}
                    className="!my-0.5"
                />
                <Button className="w-full">Reset Password</Button>
            </form>
            <Link className="cursor-pointer mt-2 underline" href={ROUTES.login}>
                Back to login
            </Link>
        </div>
    );
}

export default ForgotPassword;
