import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import InvoiceModel from "@/models/Invoice";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const { id } = params;
    const invoice = await InvoiceModel.findById(id).populate(
      "products.product"
    );
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Error fetching invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const { id } = params;
    const deletedInvoice = await InvoiceModel.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Error deleting invoice" },
      { status: 500 }
    );
  }
}

// PUT method to update an invoice
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const invoiceId = params.id;
    const body = await req.json();
    const { products, paid } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    // Retrieve the existing invoice
    const existingInvoice = await InvoiceModel.findById(invoiceId).populate(
      "products.product"
    );

    if (!existingInvoice) {
      return NextResponse.json(
        { error: `Invoice with ID ${invoiceId} not found` },
        { status: 404 }
      );
    }

    // Revert the product quantities affected by the existing invoice
    for (const item of existingInvoice.products) {
      const { product: productId, quantity } = item;
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity },
      });
    }

    let totalAmount = 0;
    const processedProducts = [];

    // Calculate the new quantities and amounts
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

    // Update the product quantities in the database
    for (const item of processedProducts) {
      const { product: productId, quantity } = item;
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -quantity },
      });
    }

    // Update the invoice with the new data
    existingInvoice.products = processedProducts;
    existingInvoice.totalAmount = totalAmount;
    existingInvoice.paid = paid;

    await existingInvoice.save();

    return NextResponse.json(existingInvoice, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Error updating invoice" },
      { status: 500 }
    );
  }
}