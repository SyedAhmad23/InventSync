import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export async function POST(req: NextRequest) {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  response.headers.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      expires: new Date(0),
      path: "/",
    })
  );

  return response;
}
