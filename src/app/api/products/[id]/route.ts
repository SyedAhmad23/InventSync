import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Supplier from "@/models/Supplier";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const product = await Product.findById(id)
      .populate("category")
      .populate("suppliers");
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
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

  const { id } = params;
  let productData;

  try {
    productData = await req.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const {
    name,
    category,
    quantity,
    unitCode,
    buyingPrice,
    sellPrice,
    sku,
    suppliers,
    image,
    description,
  } = productData;

  if (
    !name ||
    !category ||
    !quantity ||
    !unitCode ||
    !buyingPrice ||
    !sellPrice ||
    !sku ||
    !suppliers
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid category ID format" },
      { status: 400 }
    );
  }

  try {
    const supplierExists = await Supplier.findById(suppliers);
    if (!supplierExists) {
      return NextResponse.json(
        { message: "Supplier not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid Supplier ID format" },
      { status: 400 }
    );
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        quantity,
        unitCode,
        buyingPrice,
        sellPrice,
        sku,
        suppliers,
        image,
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

  const { id } = params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}