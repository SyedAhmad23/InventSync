import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectToDatabase from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }
  const { name, email, password, confirmPassword } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json(
      { message: "Password is required" },
      { status: 400 }
    );
  }

  if (!confirmPassword) {
    return NextResponse.json(
      { message: "COnfirm Password is required" },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  await newUser.save();

  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 }
  );
}
