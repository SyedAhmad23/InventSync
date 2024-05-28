import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

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

    // Calculate the total revenue
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

    return NextResponse.json(
      {
        totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
        totalRevenue,
        totalDiscount: totalDiscount[0]?.totalDiscount || 0,
        totalCategories,
        totalProducts,
        totalInvoices,
        recentInvoices,
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

function calculateTotalRevenue(invoices, products) {
  // Create a map of productId to buyingPrice
  const productPriceMap = products.reduce((map, product) => {
    map[product._id] = product.buyingPrice;
    return map;
  }, {});

  // Calculate the total revenue
  let totalRevenue = 0;
  invoices.forEach((invoice) => {
    invoice.products.forEach((item) => {
      const productId = item.product;
      const quantity = item.quantity;
      const buyingPrice = productPriceMap[productId];
      if (buyingPrice !== undefined) {
        totalRevenue += quantity * buyingPrice;
      }
    });
  });

  return totalRevenue;
}
