import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { createObjectCsvStringifier } from "csv-writer";

interface Supplier {
  name: string;
}

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Query all products from the database
    const products = await Product.find()
      .populate("category")
      .populate("suppliers");

    // Create a CSV stringifier
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "name", title: "Name" },
        { id: "category", title: "Category" },
        { id: "quantity", title: "Quantity" },
        { id: "image", title: "Image" },
        { id: "description", title: "Description" },
        { id: "unitCode", title: "Unit Code" },
        { id: "buyingPrice", title: "Buying Price" },
        { id: "sellPrice", title: "Sell Price" },
        { id: "sku", title: "SKU" },
        { id: "suppliers", title: "Suppliers" },
      ],
    });

    // Convert product data to CSV format
    const records = products.map((product) => ({
      name: product.name,
      category: product.category.name, // Assuming category has a name field
      quantity: product.quantity,
      image: product.image,
      description: product.description,
      unitCode: product.unitCode,
      buyingPrice: product.buyingPrice,
      sellPrice: product.sellPrice,
      sku: product.sku,
      suppliers: product.suppliers
        .map((supplier: Supplier) => supplier.name)
        .join(", "), // Assuming suppliers have a name field
    }));

    const csvString =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);

    // Set response headers for file download
    const fileName = "products.csv";
    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading products:", error);
    // Return an error response if an error occurs
    return NextResponse.json(
      { error: "Error downloading products" },
      { status: 500 }
    );
  }
}
