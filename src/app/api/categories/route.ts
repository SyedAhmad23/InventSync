import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await connectToDatabase();

  const categories = await Category.find();

  if (!categories || categories.length === 0) {
    return NextResponse.json(
      { message: "No categories found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name, description } = await req.json();

  const newCategory = new Category({
    name,
    description,
  });

  await newCategory.save();

  return NextResponse.json(
    { message: "Category created successfully", category: newCategory },
    { status: 201 }
  );
}
