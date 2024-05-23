import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  const { id } = params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the category" },
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
      { error: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  const { id } = params;
  let updateData;

  try {
    updateData = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { name, description, type } = updateData;

  if (!name || !description || !type) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, type },
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update the category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  const { id } = params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    await Product.deleteMany({ category: id });

    return NextResponse.json({
      message: "Category and associated products deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete the category" },
      { status: 500 }
    );
  }
}
