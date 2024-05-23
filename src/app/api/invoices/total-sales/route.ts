import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Invoice from "@/models/Invoice";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const result = await Invoice.aggregate([
      //   { $match: { paid: true } }, // Filter only paid invoices
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }, // Sum the totalAmount
    ]);

    const totalSales = result.length > 0 ? result[0].totalSales : 0;

    return NextResponse.json(
      { totalSales: totalSales.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating total sales:", error);
    return NextResponse.json(
      {
        /* @ts-ignore */ error: "Error calculating total sales",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
