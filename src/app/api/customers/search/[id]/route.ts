import connectToDatabase from "@/app/lib/db";
import Customer from "@/models/Customer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const customers = await Customer.find({
      $or: [
        { customer_name: { $regex: id, $options: "i" } },
        { phone: { $regex: id, $options: "i" } },
        { email: { $regex: id, $options: "i" } },
      ],
    }).select("customer_name _id");

    const customerData = customers.map((customer) => ({
      id: customer._id,
      name: customer.customer_name,
    }));

    return NextResponse.json(customerData, { status: 200 });
  } catch (error) {
    console.error("Error searching customers:", error);
    return NextResponse.json(
      { error: "Error searching customers" },
      { status: 500 }
    );
  }
}
