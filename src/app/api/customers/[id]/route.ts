import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Customer from "@/models/Customer";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Error fetching customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updatedCustomer = await Customer.findByIdAndUpdate(
      params.id,
      { customer_name, phone, email },
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(params.id);

    if (!deletedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 }
    );
  }
}
