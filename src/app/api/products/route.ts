import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/app/lib/db";

export async function GET() {
  await connectToDatabase();

  const products = await Product.find();

  if (!products || products.length === 0) {
    return NextResponse.json({ message: "No products found" }, { status: 404 });
  }

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name, category, description, image, quantity, price } =
    await req.json();

  const newProduct = new Product({
    name,
    category,
    description,
    image,
    quantity,
    price,
  });
  await newProduct.save();

  return NextResponse.json(
    { message: "Product created successfully", product: newProduct },
    { status: 201 }
  );
}
