import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import connectToDatabase from "@/app/lib/db";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

  // Save the reset token and expiry to the user's record
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpiry;
  await user.save();

  // Simulate sending an email (in reality, you'd send an actual email)
  console.log(`Password reset token (for testing purposes): ${resetToken}`);

  return NextResponse.json(
    { message: "Password reset link sent to your email" },
    { status: 200 }
  );
}
