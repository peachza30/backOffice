import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
   const remoteUrl = req.nextUrl.searchParams.get("url");
   if (!remoteUrl) {
      return NextResponse.json({ error: "url required" }, { status: 400 });
   }

   const upstream = await fetch(remoteUrl, { cache: "no-store" });

   if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
         { error: `PDF fetch failed: ${upstream.status}` },
         { status: upstream.status || 502 }
      );
   }

   // ดึง header ต้นทางมาก่อน แล้วแก้ไข/ลบที่เราไม่ต้องการ
   const headers = new Headers(upstream.headers);
   headers.set("Cache-Control", "no-store");
   headers.set("Content-Disposition", "inline");
   headers.set("Content-Security-Policy", "frame-ancestors 'self';");
   headers.delete("x-frame-options");            // สำคัญ
   headers.delete("content-security-policy");    // ถ้า upstream มี frame-ancestors ที่กันเรา

   return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
   });
}
 