"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/layout";
import DisplayCard from "@/app/dashboard/displayCard";
import PieChart from "@/app/dashboard/PieChart";
import RecentInvoices from "@/app/dashboard/recentInvoices";
import {
  MdMenu,
  MdMoney,
  MdOutlineDiscount,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { PiInvoiceDuotone } from "react-icons/pi";
import { useGetAllDashboardItemsQuery } from "@/feature/dashboard/dashboardApi";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GiProfit } from "react-icons/gi";
import BarChart from "@/app/dashboard/Barchart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [selectedData, setSelectedData] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleToggle = (type: "monthly" | "yearly") => {
    setSelectedData(type);
  };

  const barChartData =
    selectedData === "monthly"
      ? {
          labels: monthlySalesData.labels,
          datasets: [
            {
              label: "Monthly Sales",
              data: monthlySalesData.data,
              backgroundColor: "#FFD700",
            },
          ],
        }
      : {
          labels: yearlySalesData.labels,
          datasets: [
            {
              label: "Yearly Sales",
              data: yearlySalesData.data,
              backgroundColor: "#FFFFFF",
            },
          ],
        };

  return (
    <main className="">
      <Layout>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
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
            <DisplayCard
              logo={MdMenu}
              text="Total Categories"
              data={finalcat}
            />
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
        )}

        <Card className="bg-gray-700 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sales Data</CardTitle>
              <div className="gap-2 flex">
                <Button
                  className={
                    selectedData === "monthly"
                      ? "bg-black text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }
                  onClick={() => handleToggle("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  className={
                    selectedData === "yearly"
                      ? "bg-black text-white"
                      : " bg-gray-300 text-black hover:bg-gray-400"
                  }
                  onClick={() => handleToggle("yearly")}
                >
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-80 rounded-sm w-full" />
            </div>
          ) : (
            <BarChart
              datasets={barChartData.datasets}
              labels={barChartData.labels}
            />
          )}
        </Card>
        <div className="grid lg:grid-cols-3 gap-5 my-20">
          <Card className="bg-gray-700 text-white">
            <CardHeader>
              <CardTitle>Sales Data</CardTitle>
            </CardHeader>
            {isLoading ? (
              <Skeleton className="h-60 rounded-full w-60 mx-auto pb-10" />
            ) : (
              <PieChart
                data={chartData.map((value) => value || 0)}
                labels={[
                  "Total Sales",
                  "Total Discount Given",
                  "Total REVENUE",
                ]}
              />
            )}
          </Card>
          <Card className="lg:col-span-2 bg-gray-700 text-white">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="h-60 rounded-md w-full" />
              </div>
            ) : (
              <RecentInvoices data={recentInvoices} />
            )}
          </Card>
        </div>
      </Layout>
    </main>
  );
}
