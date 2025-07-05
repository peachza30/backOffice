import data from "@/app/api/request/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   _request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const { id } = params;

      // หา request ที่ตรงกับ id
      const request = data.data.find(item => String(item.id) === id);
      if (!request) {
         return NextResponse.json({ error: "request not found" }, { status: 404 });
      }

      return NextResponse.json(request);
   } catch (error) {
      console.error("Error fetching request data:", error);
      return NextResponse.json({ error: "Failed to fetch request data" }, { status: 500 });
   }
}
