"use client";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignupMutation } from "@/feature/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

interface SignUpFormInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Page = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
    const [signup, { isLoading }] = useSignupMutation();
    const router = useRouter();

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        try {
            const response = await signup(data).unwrap();
            console.log('Signup successful:', response);
            toast.success("User Signed up successfully")
            router.push('/login');
        } catch (err: any) {
            console.error('Signup failed:', err);
            toast.error(err.data?.message || 'Signup failed. Please try again.');
        }
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
                    <Link className="cursor-pointer underline" href={ROUTES.login}>
                        Already have an account?
                    </Link>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Page;
