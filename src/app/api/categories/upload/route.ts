import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import csv from "csv-parser";
import { Readable } from "stream";
import { finished } from "stream/promises";

export interface ParsedCategory {
  name: string;
  description: string;
}

async function parseCSV(buffer: Buffer): Promise<ParsedCategory[]> {
  const results: ParsedCategory[] = [];
  const stream = Readable.from(buffer.toString());

  const parser = stream.pipe(
    csv({
      headers: ["name", "description"],
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ header, value }) => value.trim(),
    })
  );

  parser.on("data", (data) => results.push(data));
  parser.on("error", (error) => {
    console.error("Error parsing CSV:", error);
  });

  await finished(parser);

  const validCategories = results.filter(
    (category) => category.name && category.description
  );

  console.log("Filtered categories:", validCategories);

  return validCategories;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const categories = await parseCSV(buffer);

    await Category.insertMany(categories);

    return NextResponse.json(
      { message: "Categories uploaded successfully" },
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
