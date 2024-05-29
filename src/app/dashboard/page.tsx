"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfig } from "@/app/config/hooks";
import Layout from "@/components/layout/layout";
import DisplayCard from "@/app/dashboard/displayCard";
import PieChart from "@/app/dashboard/PieChart";
import RecentInvoices from "@/app/dashboard/recentInvoices";
import { MdMenu, MdMoney, MdOutlineDiscount, MdProductionQuantityLimits } from "react-icons/md";
import { PiInvoiceDuotone } from "react-icons/pi";
import { useGetAllDashboardItemsQuery } from "@/feature/dashboard/dashboardApi";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GiProfit } from "react-icons/gi";
import BarChart from "@/app/dashboard/Barchart";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  // const { userToken } = useConfig();

  // useEffect(() => {
  //   if (!userToken) {
  //     router.replace("/login");
  //   }
  // }, [userToken, router]);

  const { data, error, isLoading } = useGetAllDashboardItemsQuery();
  console.log("dashboard data:", data);

  // if (!userToken) {
  //   return <div>Loading...</div>;
  // }
  const finalcat = data?.totalCategories;
  const finalProducts = data?.totalProducts;
  const finalSales = data?.totalSales;
  const finalInvoice = data?.totalInvoices;
  const recentInvoices = data?.recentInvoices;
  const finalDiscount = data?.totalDiscount;
  const finalRevenue = data?.totalRevenue;
  const chartData = [finalSales, finalDiscount, finalRevenue];

  const monthlySalesData = data?.monthlySalesData || { labels: [], data: [] };
  const yearlySalesData = data?.yearlySalesData || { labels: [], data: [] };

  const [selectedData, setSelectedData] = useState<"monthly" | "yearly">("monthly");

  const handleToggle = (type: "monthly" | "yearly") => {
    setSelectedData(type);
  };

  const barChartData = selectedData === "monthly" ? {
    labels: monthlySalesData.labels,
    datasets: [
      {
        label: "Monthly Sales",
        data: monthlySalesData.data,
        backgroundColor: "#1A4D2E",
      }
    ],
  } : {
    labels: yearlySalesData.labels,
    datasets: [
      {
        label: "Yearly Sales",
        data: yearlySalesData.data,
        backgroundColor: "#003285",
      }
    ],
  };

  return (
    <main className="">
      <Layout>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          <DisplayCard logo={MdMoney} text="Total Sales" data={finalSales} />
          <DisplayCard
            logo={MdOutlineDiscount}
            data={finalDiscount}
            text="Total Discount Given"
          />
          <DisplayCard
            logo={GiProfit}
            data={finalRevenue}
            text="Total Revenue"
          />
          <DisplayCard logo={MdMenu} text="Total Categories" data={finalcat} />
          <DisplayCard
            logo={MdProductionQuantityLimits}
            text="Total Products"
            data={finalProducts}
          />
          <DisplayCard
            logo={PiInvoiceDuotone}
            text="Total Invoice"
            data={finalInvoice}
          />
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sales Data</CardTitle>
              <div className="gap-2 flex">
                <Button
                  className={selectedData === "monthly" ? "bg-gray-200" : ""}
                  onClick={() => handleToggle("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  className={selectedData === "yearly" ? "bg-gray-200" : ""}
                  onClick={() => handleToggle("yearly")}
                >
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
          <BarChart
            datasets={barChartData.datasets}
            labels={barChartData.labels}
          />
        </Card>
        <div className="grid lg:grid-cols-3 gap-5 my-20">
          <Card>
            <CardHeader>
              <CardTitle>Sales Data</CardTitle>
            </CardHeader>
            <PieChart
              data={chartData.map((value) => value || 0)}
              labels={[
                "Total Sales",
                "Total Discount Given",
                "Total REVENUE",
              ]}
            />
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <RecentInvoices data={recentInvoices} />
          </Card>
        </div>
      </Layout>
    </main>
  );
}
