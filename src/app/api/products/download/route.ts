import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import ProductModel from "@/models/Product";
import { createObjectCsvWriter } from "csv-writer";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Query all products from the database
    const products = await ProductModel.find();

    // Define the file path for the CSV file
    const filePath = join(process.cwd(), "products.csv");

    // Create a CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "name", title: "Name" },
        { id: "category", title: "Category" },
        { id: "description", title: "Description" },
        { id: "image", title: "Image" },
        { id: "quantity", title: "Quantity" },
        { id: "price", title: "Price" },
      ],
    });

    // Write the records to the CSV file
    await csvWriter.writeRecords(products);

    console.log(filePath);

    // Send the CSV file as a response
    return NextResponse.json(filePath);
  } catch (error) {
    console.error("Error downloading products:", error);
    // Return an error response if an error occurs
    return NextResponse.json(
      { error: "Error downloading products" },
      { status: 500 }
    );
  }
}