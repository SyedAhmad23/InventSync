import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

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
      map[product._id] = {
        buyingPrice: product.buyingPrice,
        sellPrice: product.sellPrice,
      };
      return map;
    }, {});

    console.log("invoices", invoices);

    let totalRevenue = 0;
    let totalAppliedDiscount = 0; // New variable to track total discount

    invoices.forEach((invoice) => {
      // @ts-ignore
      invoice.products.forEach((item) => {
        const productId = item.product.toString();
        const quantity = item.quantity;
        const discount = item.discount;
        const discountType = item.discount_type; // New variable for discount type
        const productData = productPriceMap[productId];

        if (productData) {
          let revenuePerItem =
            (productData.sellPrice - productData.buyingPrice) * quantity;

          if (discountType === "fixed") {
            totalAppliedDiscount += discount * quantity; // Track fixed discount
          } else if (discountType === "percentage") {
            const discountAmount = (productData.sellPrice * discount) / 100;
            totalAppliedDiscount += discountAmount * quantity; // Track percentage discount
          }

          totalRevenue += revenuePerItem;
        }
      });
    });

    // Subtract totalAppliedDiscount from totalRevenue
    totalRevenue -= totalAppliedDiscount;

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
