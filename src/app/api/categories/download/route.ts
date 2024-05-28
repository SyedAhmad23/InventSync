import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import { createObjectCsvStringifier } from "csv-writer";

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Query all categories from the database
    const categories = await Category.find();

    // Create a CSV stringifier
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "_id", title: "ID" },
        { id: "name", title: "Name" },
        { id: "description", title: "Description" },
      ],
    });

    // Convert category data to CSV format
    const records = categories.map((category) => ({
      _id: category._id.toString(), // Convert ObjectId to string
      name: category.name,
      description: category.description,
    }));

    const csvString =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);

    // Set response headers for file download
    const fileName = "categories.csv";
    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading categories:", error);
    // Return an error response if an error occurs
    return NextResponse.json(
      { error: "Error downloading categories" },
      { status: 500 }
    );
  }
}
