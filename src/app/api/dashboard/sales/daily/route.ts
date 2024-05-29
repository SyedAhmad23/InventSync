import connectToDatabase from "@/app/lib/db";
import Invoice from "@/models/Invoice";
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
    const startOfDay = new Date("2024-05-01T00:00:00.000Z");
    const endOfDay = new Date("2024-05-01T23:59:59.999Z");

    const mayFirstSales = await Invoice.aggregate([
      {
        $match: {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$total_discount" },
        },
      },
    ]);

    return NextResponse.json(
      {
        totalSales: mayFirstSales.length > 0 ? mayFirstSales[0].totalSales : 0,
        totalDiscount:
          mayFirstSales.length > 0 ? mayFirstSales[0].totalDiscount : 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    return NextResponse.json(
      { error: "Error fetching daily sales data" },
      { status: 500 }
    );
  }
}
