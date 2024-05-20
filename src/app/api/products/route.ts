import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/app/lib/db";

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
