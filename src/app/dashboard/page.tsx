"use client";
import React, { useState } from 'react';
import Layout from "@/components/layout/layout";
import DisplayCard from "@/app/dashboard/displayCard";
import PieChart from "@/app/dashboard/PieChart";
import RecentInvoices from "@/app/dashboard/recentInvoices";
import { MdMenu, MdMoney, MdOutlineDiscount, MdProductionQuantityLimits } from "react-icons/md";
import { PiInvoiceDuotone } from "react-icons/pi";
import { useGetAllDashboardItemsQuery } from "@/feature/dashboard/dashboardApi";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GiProfit } from "react-icons/gi";
import BarChart from "./Barchart";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function Home() {
    const { data, error, isLoading } = useGetAllDashboardItemsQuery();
    console.log("dashboard data:", data);

    const chartData = [data?.totalSales, data?.totalRecieved, data?.totalRecievables];

    const finalcat = data?.totalCategories;
    const finalProducts = data?.totalProducts;
    const finalSales = data?.totalSales;
    const finalInvoice = data?.totalInvoices;
    const recentInvoices = data?.recentInvoices;

    const getMonthName = (monthIndex: number) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    };

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const daysInMonth = getDaysInMonth(selectedMonth, currentYear);

    const salesData = {
        labels: Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`),
        data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 100) + 1),
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(Number(value));
    };

    return (
        <main className="">
            <Layout>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                    <DisplayCard logo={MdMoney} text="Total Sales" data={finalSales} />
                    <DisplayCard logo={MdOutlineDiscount} data={0} text="Total DISCOUNT GIVEN" />
                    <DisplayCard logo={GiProfit} data={0} text="Total REVENUE" />

                    <DisplayCard logo={MdMenu} text="Total Categories" data={finalcat} />
                    <DisplayCard logo={MdProductionQuantityLimits} text="Total Products" data={finalProducts} />
                    <DisplayCard logo={PiInvoiceDuotone} text="Total Invoice" data={finalInvoice} />
                </div>

                <div className="grid lg:grid-cols-3 gap-5 my-20">
                    <Card>
                        <CardHeader>
                            <CardTitle>Last 365 days Sales</CardTitle>
                        </CardHeader>
                        <PieChart data={chartData.map((value) => value || 0)} labels={['Total Sales', 'Total Received Amount', 'Total Receivable']} />
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                        </CardHeader>
                        <RecentInvoices data={recentInvoices} />
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between">
                            <div>
                                <CardTitle>Monthly Sales</CardTitle>
                            </div>
                            <div>
                                <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }).map((_, index) => (
                                            <SelectItem key={index} value={index.toString()}>
                                                {getMonthName(index)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <BarChart
                        data={salesData.data}
                        labels={salesData.labels}
                        backgroundColors={['#1A4D2E']}
                    />
                </Card>
            </Layout>
        </main >
    );
}
