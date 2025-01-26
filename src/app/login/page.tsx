"use client";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@/feature/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useConfig } from "../config/hooks";
import { Loader } from "lucide-react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [login, { isLoading }] = useLoginMutation();
  const { updateUser } = useConfig();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await login(data).unwrap();
      console.log("Login successful:", response);
      toast.success("Login successful");
      updateUser(response.user, response.token);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center mx-auto container bg w-96 gap-5 h-screen">
        <Logo className="w-20 h-20" />
        <h1 className="font-bold text-2xl">Login To InventSync</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full gap-10 bg-white p-2 pt-4 rounded-md"
        >
          <div className="w-full mb-5">
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="john@gmail.com"
              {...register("email", { required: "Email is required" })}
              className={
                errors.password ? "border-red-500 text-black" : "text-black"
              }
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="w-full mb-2">
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="*********"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={
                errors.password ? "border-red-500 text-black" : "text-black"
              }
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
          <Link
            className="cursor-pointer underline text-black text-sm"
            href={ROUTES.forgotPassword}
          >
            Forgot Password?
          </Link>
          <Button type="submit" className="w-full mt-5" disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" /> : "Login"}
          </Button>
          <Link
            className="cursor-pointer mt-2 text-sm underline hidden"
            href={ROUTES.signUp}
          >
            Don&apos;t have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Page;
