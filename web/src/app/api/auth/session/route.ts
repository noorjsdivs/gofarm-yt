import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set the Firebase token as an httpOnly cookie
    // Expires in 55 minutes (slightly less than Firebase's 1 hour to be safe)
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 55 * 60, // 55 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error setting auth cookie:", error);
    return NextResponse.json(
      { error: "Failed to set auth cookie" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete("session");
  response.cookies.delete("firebaseToken"); // Also delete legacy cookie if exists

  return response;
}
