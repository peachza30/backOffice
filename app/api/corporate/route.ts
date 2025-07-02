import data from "@/app/api/corporate/data";

import { NextResponse, NextRequest } from "next/server";
export async function GET() {
   try {
      const corporates = data;

      return NextResponse.json(corporates);
   } catch (error) {
      console.error("Error fetching corporate data:", error);
      return NextResponse.json({ error: "Failed to fetch corporate data" }, { status: 500 });
   }
}
