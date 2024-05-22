import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";

export async function GET() {
  await connectToDatabase();

  try {
    const invoices = await Invoice.find().populate("products.product");
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { products } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const processedProducts = [];

    for (const item of products) {
      const { product: productId, quantity } = item;

      // Fetch product details
      const product = await Product.findById(productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${productId} not found` },
          { status: 404 }
        );
      }

      const amount = product.price * quantity;
      totalAmount += amount;

      processedProducts.push({
        product: productId,
        quantity,
        amount,
      });
    }

    const invoice = new Invoice({
      products: processedProducts,
      totalAmount,
      paid: false,
    });

    await invoice.save();

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Error creating invoice" },
      { status: 500 }
    );
  }
}
