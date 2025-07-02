import data from "@/app/api/corporate/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   _request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const { id } = params;

      // หา corporate ที่ตรงกับ id
      const corporate = data.data.find(item => String(item.id) === id);
      if (!corporate) {
         return NextResponse.json({ error: "Corporate not found" }, { status: 404 });
      }

      return NextResponse.json(corporate);
   } catch (error) {
      console.error("Error fetching corporate data:", error);
      return NextResponse.json({ error: "Failed to fetch corporate data" }, { status: 500 });
   }
}
