import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import ProductModel from "@/models/Product";
import csv from "csv-parser";
import { Readable } from "stream";
import { finished } from "stream/promises";

export interface ParsedProduct {
  name: string;
  category: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

async function parseCSV(buffer: Buffer): Promise<ParsedProduct[]> {
  const results: ParsedProduct[] = [];
  const stream = Readable.from(buffer.toString());

  const parser = stream.pipe(
    csv({
      headers: [
        "name",
        "category",
        "description",
        "image",
        "quantity",
        "price",
      ],
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ header, value }) => {
        if (header === "quantity") return parseInt(value.trim(), 10);
        if (header === "price") return parseFloat(value.trim());
        return value.trim();
      },
    })
  );

  parser.on("data", (data) => results.push(data));
  parser.on("error", (error) => {
    console.error("Error parsing CSV:", error);
  });

  await finished(parser);

  const validProducts = results.filter(
    (product) =>
      product.name &&
      product.category &&
      product.description &&
      product.image &&
      !isNaN(product.quantity) &&
      !isNaN(product.price)
  );

  console.log("Filtered products:", validProducts);

  return validProducts;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const products = await parseCSV(buffer);

    await ProductModel.insertMany(products);

    return NextResponse.json(
      { message: "Products uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing CSV file:", error);
    return NextResponse.json(
      { error: "Error processing CSV file" },
      { status: 500 }
    );
  }
}
