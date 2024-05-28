import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import CustomerModel from "@/models/Customer";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    const skip = (pageInt - 1) * limitInt;

    const search = searchParams.get("search");
    const searchQuery = search
      ? { customer_name: { $regex: search, $options: "i" } }
      : {};

    const customers = await CustomerModel.find(searchQuery)
      .skip(skip)
      .limit(limitInt);

    const totalCustomers = await CustomerModel.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalCustomers / limitInt);

    return NextResponse.json({
      customers,
      totalPages,
      currentPage: pageInt,
      totalCustomers,
    });
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

    const newCustomer = new CustomerModel({ customer_name, phone, email });

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
