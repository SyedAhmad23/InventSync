import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }

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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  try {
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

    const lastInvoice = await Invoice.findOne(
      {},
      {},
      { sort: { invoiceNumber: -1 } }
    );
    const invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;

    const invoice = new Invoice({
      customer: customertoCreate._id,
      date,
      products: processedProducts,
      totalAmount,
      total_discount,
      grand_total,
      return_amount,
      totalPaid,
      invoiceNumber,
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