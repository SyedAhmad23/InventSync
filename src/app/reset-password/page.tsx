"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/feature/auth/authApi";
import { ROUTES } from "@/constants/routes";
import { toast } from "react-toastify";

type FormInputs = {
    newPassword: string;
    confirmNewPassword: string;
};

function ResetPassword() {
    const { register, handleSubmit } = useForm<FormInputs>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [resetPassword] = useResetPasswordMutation();

    const onSubmitHandler = async (data: FormInputs) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("Passwords do not match");
            return;
        }
        const token = searchParams.get("token");
        if (!token) {
            toast.error("Invalid or missing token");
            return;
        }
        try {
            await resetPassword({
                token,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword
            }).unwrap();
            router.push(ROUTES.login);
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
            <h1 className="mb-8 text-2xl font-bold">Set New Password</h1>
            <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-2 w-full md:w-80">
                <Input
                    id="newPassword"
                    placeholder="New Password"
                    type="password"
                    {...register("newPassword", { required: true })}
                    className="!my-0.5"
                />
                <Input
                    id="confirmNewPassword"
                    placeholder="Confirm New Password"
                    type="password"
                    {...register("confirmNewPassword", { required: true })}
                    className="!my-0.5"
                />
                <Button className="w-full">Set Password</Button>
            </form>
        </div>
    );
}

export default ResetPassword;
