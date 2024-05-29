import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Supplier from "@/models/Supplier";

export async function GET() {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  let products;

  try {
    products = await Product.find().populate("category").populate("suppliers");
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products from the database" },
      { status: 500 }
    );
  }

  if (!products || products.length === 0) {
    return NextResponse.json({ message: "No products found" }, { status: 404 });
  }

  return NextResponse.json({ products }, { status: 200 });
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

  const newProduct = new Product({
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
  });

  try {
    await newProduct.save();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create product." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Product created successfully", product: newProduct },
    { status: 201 }
  );
}