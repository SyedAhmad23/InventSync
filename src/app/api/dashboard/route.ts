import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

interface Product {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  discount: number;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  try {
    const totalSales = await Invoice.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalDiscount = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalDiscount: { $sum: "$total_discount" },
        },
      },
    ]);

    const invoices = await Invoice.find();
    const products = await Product.find();
    const productPriceMap = products.reduce((map, product) => {
      map[product._id] = product.buyingPrice;
      return map;
    }, {});

    let totalRevenue = 0;
    invoices.forEach((invoice) => {
      // @ts-ignore
      invoice.products.forEach((item) => {
        const productId = item.product;
        const quantity = item.quantity;
        const buyingPrice = productPriceMap[productId];
        if (buyingPrice !== undefined) {
          totalRevenue += quantity * buyingPrice;
        }
      });
    });

    const totalCategories = await Category.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalInvoices = await Invoice.countDocuments();

    const recentInvoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate daily sales
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const dailySales = await calculateSales(startOfToday, endOfToday);

    // Calculate monthly sales
    const startOfMonthDate = startOfMonth(today);
    const endOfMonthDate = endOfMonth(today);
    const monthlySales = await calculateSales(startOfMonthDate, endOfMonthDate);

    return NextResponse.json(
      {
        totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
        totalRevenue,
        totalDiscount: totalDiscount[0]?.totalDiscount || 0,
        totalCategories,
        totalProducts,
        totalInvoices,
        recentInvoices,
        dailySales,
        monthlySales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}

async function calculateSales(startDate: Date, endDate: Date) {
  const sales = await Invoice.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$grand_total" },
      },
    },
  ]);
  return sales.length > 0 ? sales[0].totalSales : 0;
}
