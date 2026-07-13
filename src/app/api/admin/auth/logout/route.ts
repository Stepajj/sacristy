import { NextRequest, NextResponse } from "next/server";

function shouldUseSecureCookie(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  return forwardedProto === "https" || request.nextUrl.protocol === "https:";
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
