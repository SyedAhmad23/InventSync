import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Supplier from "@/models/Supplier";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const supplier = await Supplier.findById(params.id);
    if (!supplier) {
      return NextResponse.json(
        { message: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return NextResponse.json(
      { message: "Error fetching supplier" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      params.id,
      { name, contact_person, email, phone, address },
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return NextResponse.json(
        { message: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { message: "Error updating supplier" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await connectToDatabase();
    const deletedSupplier = await Supplier.findByIdAndDelete(params.id);
    if (!deletedSupplier) {
      return NextResponse.json(
        { message: "Supplier not found" },
        { status: 404 }
      );
    }
    const { deletedCount } = await Product.deleteMany({ suppliers: id });

    return NextResponse.json({
      message: `Supplier and ${deletedCount} associated products deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { message: "Error deleting supplier" },
      { status: 500 }
    );
  }
}
