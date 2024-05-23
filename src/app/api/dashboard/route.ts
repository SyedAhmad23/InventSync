import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

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
    // Calculate total recievables amount (totalAmount of unpaid invoices)
    const totalRecievables = await Invoice.aggregate([
      { $match: { paid: false } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    // Calculate total recieved amount (totalAmount of paid invoices)
    const totalRecieved = await Invoice.aggregate([
      { $match: { paid: true } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    // Calculate total sales (totalAmount of both paid and unpaid invoices)
    const totalSales = await Invoice.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    // Count total categories
    const totalCategories = await Category.countDocuments();

    // Count total products
    const totalProducts = await Product.countDocuments();

    // Count total Invoices
    const totalInvoices = await Invoice.countDocuments();

    const recentInvoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(
      {
        totalRecievables:
          totalRecievables.length > 0 ? totalRecievables[0].totalAmount : 0,
        totalRecieved:
          totalRecieved.length > 0 ? totalRecieved[0].totalAmount : 0,
        totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
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