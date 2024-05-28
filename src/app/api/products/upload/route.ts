import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Supplier from "@/models/Supplier";
import csv from "csv-parser";
import { Readable } from "stream";
import { finished } from "stream/promises";

export interface ParsedProduct {
  name: string;
  category: string; // Changed to string (category._id)
  description?: string;
  image?: string;
  quantity: number;
  unitCode: string;
  buyingPrice: number;
  sellPrice: number;
  sku: string;
  suppliers?: string; // Changed from string[] to string
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
        "unitCode",
        "buyingPrice",
        "sellPrice",
        "sku",
        "suppliers",
      ],
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ header, value }) => {
        if (header === "quantity") return parseInt(value.trim(), 10);
        if (header === "buyingPrice" || header === "sellPrice")
          return parseFloat(value.trim());
        if (header === "suppliers") return value.trim(); // Changed
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
      !isNaN(product.quantity) &&
      product.unitCode &&
      !isNaN(product.buyingPrice) &&
      !isNaN(product.sellPrice) &&
      product.sku
  );

  console.log("Filtered products:", validProducts);

  return validProducts;
}

async function checkCategoryAndSuppliers(products: ParsedProduct[]) {
  const categories = new Set<string>();
  const suppliers = new Set<string>();

  products.forEach((product) => {
    categories.add(product.category);
    if (product.suppliers) {
      suppliers.add(product.suppliers);
    }
  });

  const existingCategories = await Category.find({
    _id: { $in: Array.from(categories) },
  });
  const existingSuppliers = await Supplier.find({
    _id: { $in: Array.from(suppliers) },
  });

  const existingCategoryIds = new Set(
    existingCategories.map((category) => category._id.toString())
  );
  const existingSupplierIds = new Set(
    existingSuppliers.map((supplier) => supplier._id.toString())
  );

  const invalidCategories = Array.from(categories).filter(
    (category) => !existingCategoryIds.has(category)
  );
  const invalidSuppliers = Array.from(suppliers).filter(
    (supplier) => !existingSupplierIds.has(supplier)
  );

  return { invalidCategories, invalidSuppliers };
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const products = await parseCSV(buffer);

    const { invalidCategories, invalidSuppliers } =
      await checkCategoryAndSuppliers(products);

    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { error: `Invalid categories: ${invalidCategories.join(", ")}` },
        { status: 400 }
      );
    }

    if (invalidSuppliers.length > 0) {
      return NextResponse.json(
        { error: `Invalid suppliers: ${invalidSuppliers.join(", ")}` },
        { status: 400 }
      );
    }

    await Product.insertMany(products);

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
