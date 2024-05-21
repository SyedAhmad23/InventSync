import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/app/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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

  // Send email
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: "Password Reset Link",
    text: `Here is your password reset link: http://localhost:3000/reset-password?token=${resetToken}`,
    html: `<p>Here is your password reset link: <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return NextResponse.json(
      { error: "Error sending password reset email" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Password reset link sent to your email" },
    { status: 200 }
  );
}
