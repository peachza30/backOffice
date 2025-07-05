import data from "@/app/api/request/data";

import { NextResponse} from "next/server";
export async function GET() {
   try {
      const requests = data;

      return NextResponse.json(requests);
   } catch (error) {
      console.error("Error fetching requests data:", error);
      return NextResponse.json({ error: "Failed to fetch requests data" }, { status: 500 });
   }
}
