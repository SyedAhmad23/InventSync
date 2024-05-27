import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const { _id, quantity, unitCode, sellPrice } = product;

    const productDetails = {
      id: _id,
      available_quantity: quantity,
      unitCode,
      sellPrice,
    };

    return NextResponse.json(productDetails);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}
