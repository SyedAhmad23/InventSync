import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { partialName: string } }
) {
  try {
    await connectToDatabase();

    const { partialName } = params;

    if (!partialName) {
      return NextResponse.json(
        { error: "Partial name parameter is required" },
        { status: 400 }
      );
    }

    const products = await Product.find({
      name: { $regex: new RegExp(partialName, "i") },
    }).select("_id name");

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Error searching products" },
      { status: 500 }
    );
  }
}
