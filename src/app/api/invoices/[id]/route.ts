import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import InvoiceModel from "@/models/Invoice";
import Product from "@/models/Product";
import Customer from "@/models/Customer";

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

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { customer, customer_type, date, products, totalPaid } = body;

    if (
      !customer ||
      !customer_type ||
      !date ||
      !products ||
      products.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: customer, date, customer_type or products",
        },
        { status: 400 }
      );
    }

    let customertoCreate;

    if (customer_type === "new") {
      if (!customer || !customer.customer_name || !customer.phone) {
        return NextResponse.json(
          { error: "Missing customer details for new customer" },
          { status: 400 }
        );
      }

      const newCustomer = new Customer({
        customer_name: customer.customer_name,
        phone: customer.phone,
        email: customer.email,
      });

      customertoCreate = await newCustomer.save();
    } else if (customer_type === "old") {
      if (!customer || !customer._id) {
        return NextResponse.json(
          { error: "Missing customer ID for old customer" },
          { status: 400 }
        );
      }
      customertoCreate = customer;
    } else {
      return NextResponse.json(
        { error: "Invalid customer_type. It should be 'new' or 'old'" },
        { status: 400 }
      );
    }

    const existingInvoice = await InvoiceModel.findById(id);
    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Restore the old quantities
    for (const item of existingInvoice.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }

    let totalAmount = 0;
    let total_discount = 0;
    const processedProducts = [];

    for (const item of products) {
      const { productId, quantity, discount, discount_type } = item; // Change to productId here

      const product = await Product.findById(productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${productId} not found` },
          { status: 404 }
        );
      }

      if (quantity > product.quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for product ID ${productId}` },
          { status: 400 }
        );
      }

      const rate = product.sellPrice;
      let discountAmount = 0;

      if (discount_type === "percentage") {
        discountAmount = (rate * quantity * discount) / 100;
      } else {
        discountAmount = discount * quantity;
      }

      const total = rate * quantity - discountAmount;
      totalAmount += total;
      total_discount += discountAmount;

      processedProducts.push({
        product: productId,
        availableQty: product.quantity,
        quantity,
        unitCode: product.unitCode,
        rate,
        discount,
        discount_type,
        total,
      });

      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -quantity },
      });
    }

    const grand_total = totalAmount;
    const return_amount = totalPaid - grand_total;

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      {
        customer: customertoCreate._id,
        date,
        products: processedProducts,
        totalAmount,
        total_discount,
        grand_total,
        return_amount,
        totalPaid,
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Error updating invoice" },
      { status: 500 }
    );
  }
}
