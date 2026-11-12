import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSessionToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const authHeader = request.headers.get("authorization");

    let token = "";
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    } else if (sessionCookie) {
      token = sessionCookie;
    }

    if (token) {
      const payload = verifyAdminSessionToken(token);
      if (payload) {
        return NextResponse.json(
          {
            authenticated: true,
            user: payload.user || "admin",
            role: payload.role || "Administrator",
            loggedInAt: new Date(payload.iat).toISOString(),
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        authenticated: false,
        message: "No active session",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Auth check failed",
      },
      { status: 200 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    {
      authenticated: false,
      message: "Session terminated successfully",
    },
    { status: 200 }
  );

  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
