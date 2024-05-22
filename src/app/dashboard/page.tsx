"use client";
import Layout from "@/components/layout/layout";
import DisplayCard from "@/app/dashboard/displayCard";
import PieChart from "@/app/dashboard/PieChart";
import RecentInvoices from "@/app/dashboard/recentInvoices";
import { MdMenu, MdMoney, MdProductionQuantityLimits } from "react-icons/md";
import { PiInvoiceDuotone } from "react-icons/pi";

export default function Home() {
    const data = [2000, 5000, 100];
    const labels = ['Total Received Amount', 'Total Receivable', 'Total Discount Given',];
    return (
        <main className="">
            <Layout>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                    <DisplayCard number={500} text="TOTAL RECEIVABLE" />
                    <DisplayCard number={700} text="Total RECEIVED AMOUNT" />
                    <DisplayCard number={800} text="Total DISCOUNT GIVEN" />
                    <DisplayCard number={800} text="Total REVENUE" />

                    <DisplayCard logo={MdMoney} text="Total Sales" number={100} />
                    <DisplayCard logo={MdMenu} text="Total Categories" number={100} />
                    <DisplayCard logo={MdProductionQuantityLimits} text="Total Products" number={100} />
                    <DisplayCard logo={PiInvoiceDuotone} text="Total Invoice" number={100} />
                </div>

                <div className="grid lg:grid-cols-3 gap-5 my-20">
                    <div className="border-2 p-4 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-2">365 Days Sales chart
                        </h3>
                        <PieChart data={data} labels={labels} />
                    </div>
                    <div className="lg:col-span-2 border-2 p-4 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-2">Recent Invoices</h3>
                        <RecentInvoices />
                    </div>
                </div>
            </Layout>
        </main>
    );
}
