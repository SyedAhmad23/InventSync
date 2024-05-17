"use client";
import Layout from "@/components/ui/layout/layout";
import Image from "next/image";
import product from "@/assets/icons/product.png";
import DisplayCard from "./displayCard";
export default function Home() {
  return (
    <main className="">
      <Layout>
        <div className=" grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <DisplayCard number={500} text="TOTAL RECEIVABLE" className=" flex bg-blue-200 font-bold" />
          <DisplayCard number={700} text="Total RECEIVED AMOUNT" className=" flex bg-slate-200 font-bold" />
          <DisplayCard number={800} text="Total DISCOUNT GIVEN" className=" flex bg-green-50 font-bold" />
          <DisplayCard number={800} text="Total REVENUE" className=" flex bg-emerald-100 font-bold" />
        </div>

        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-10 my-10">
          <DisplayCard logo={product} text="Total Users" number={100} />
          <DisplayCard logo={product} text="Total Users" number={100} />
          <DisplayCard logo={product} text="Total Users" number={100} />

        </div>

      </Layout>
    </main>
  );
}
