import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Supplier from "@/models/Supplier";

export async function GET() {
  try {
    await connectToDatabase();
    const suppliers = await Supplier.find();
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { message: "Error fetching suppliers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  let supplierData;
  try {
    supplierData = await req.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { name, contact_person, email, phone, address } = supplierData;

  if (!name || !contact_person) {
    return NextResponse.json(
      { message: "Name and Contact Person are required" },
      { status: 400 }
    );
  }

  try {
    const newSupplier = new Supplier({
      name,
      contact_person,
      email,
      phone,
      address,
    });
    await newSupplier.save();
    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { message: "Error creating supplier" },
      { status: 500 }
    );
  }
}
