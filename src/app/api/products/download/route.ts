// app/api/products/download/route.js
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { createObjectCsvStringifier } from "csv-writer";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const products = await Product.find();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "name", title: "name" },
        { id: "category", title: "category" },
        { id: "quantity", title: "quantity" },
        { id: "image", title: "image" },
        { id: "description", title: "description" },
        { id: "unitCode", title: "unitCode" },
        { id: "buyingPrice", title: "buyingPrice" },
        { id: "sellPrice", title: "sellPrice" },
        { id: "sku", title: "sku" },
        { id: "suppliers", title: "suppliers" },
      ],
    });

    const records = products.map((product) => ({
      name: product.name,
      category: product.category.name,
      quantity: product.quantity,
      image: product.image,
      description: product.description,
      unitCode: product.unitCode,
      buyingPrice: product.buyingPrice,
      sellPrice: product.sellPrice,
      sku: product.sku,
      suppliers: product.suppliers ? product.suppliers.name : "",
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
