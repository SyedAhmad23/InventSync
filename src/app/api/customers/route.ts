import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Customer from "@/models/Customer";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const customers = await Customer.find();
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { customer_name, phone, email } = body;

    if (!customer_name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: customer_name, phone" },
        { status: 400 }
      );
    }

    const newCustomer = new Customer({ customer_name, phone, email });

    await newCustomer.save();

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 }
    );
  }
}
