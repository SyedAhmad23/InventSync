import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectToDatabase from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }
  const { email, password } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json(
      { message: "Password is required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  return NextResponse.json({ token }, { status: 200 });
}
