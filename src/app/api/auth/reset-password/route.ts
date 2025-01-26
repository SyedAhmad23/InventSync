import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectToDatabase from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }

  const { token, newPassword, confirmNewPassword } = await req.json();

  if (!token || !newPassword || !confirmNewPassword) {
    console.error("Invalid input:", { token, newPassword, confirmNewPassword });
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (newPassword !== confirmNewPassword) {
    console.error("Passwords do not match");
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password updated successfully");
    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
