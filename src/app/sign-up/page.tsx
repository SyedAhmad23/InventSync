"use client";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface SignUpFormInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Page = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();

    const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
        console.log(data);
        // Perform signup action here
    };

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col items-center justify-center mx-auto container w-96 gap-5 h-screen">
                <Logo className="w-20 h-20" />
                <h1 className="font-bold text-2xl">Sign Up To Inventory</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <div className="w-full mb-5">
                        <Input
                            label="Name"
                            type="text"
                            id="name"
                            placeholder="john"
                            {...register("name", { required: "Name is required" })}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>

                    <div className="w-full mb-5">
                        <Input
                            label="Email"
                            type="email"
                            id="email"
                            placeholder="john@gmail.com"
                            {...register("email", { required: "Email is required" })}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="w-full mb-5">
                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="*********"
                            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </div>

                    <div className="w-full mb-5">
                        <Input
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            placeholder="*********"
                            {...register("confirmPassword", { required: "Confirm Password is required", minLength: { value: 8, message: "Confirm Password must be at least 8 characters" } })}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                    </div>

                    <Button type="submit" className="w-full">Sign Up</Button>
                </form>
            </div>
        </div>
    );
};

export default Page;
