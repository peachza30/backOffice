import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "@/config/refresh-token";

export async function GET(request: NextRequest) {
  console.log("Refreshing token...");
  console.log(request);
  const cookieName = process.env.NEXT_PUBLIC_COOKIES_NAME || '';
  const token = request.cookies.get(cookieName)?.value;

  const cookieNames = [
    cookieName,
    "token",
    "userId",
  ].filter(Boolean);
  console.log("cookieNames", cookieNames);

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const newToken = await refreshToken(token);
  
  if (!newToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/dashboard';
  const redirectUrl = new URL(returnUrl, request.url);
  const res = NextResponse.redirect(redirectUrl);

  // Remove existing cookies before setting the new one
  cookieNames.forEach((name) => {
    res.cookies.delete(name);
  });

  // Set the refreshed token
  res.cookies.set(cookieName, newToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "development",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
