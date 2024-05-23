import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";

export async function GET() {
  await connectToDatabase();

  try {
    const invoices = await Invoice.find().populate("products");
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { paid: boolean } }
) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { products, paid } = body;

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

      const product = await Product.findById(productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${productId} not found` },
          { status: 404 }
        );
      }

      // Check if the product quantity is available
      if (quantity > product.quantity) {
        return NextResponse.json(
          {
            error: `Quantity of product with ID ${productId} is not available. Available quantity: ${product.quantity}`,
          },
          { status: 400 }
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

    // Update the product quantity in the database
    for (const item of processedProducts) {
      const { product: productId, quantity } = item;
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -quantity },
      });
    }

    const invoice = new Invoice({
      products: processedProducts,
      totalAmount,
      paid,
    });

    console.log(invoice, "invoice");

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