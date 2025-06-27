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
    "userId"
  ].filter(Boolean);
  console.log("cookieNames", cookieNames);

  cookieNames.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.tfac.or.th`;
  });

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

  // ✅ ลบ cookie เก่าก่อน (optional แต่ชัดเจน)
  res.cookies.delete(cookieName);

  // ✅ เซ็ต cookie ใหม่
  res.cookies.set(cookieName, newToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "development",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
