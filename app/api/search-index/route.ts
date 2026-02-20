import { NextResponse } from "next/server";

import { getAllShoes } from "@/lib/server-data";

export async function GET() {
  const shoes = await getAllShoes();
  return NextResponse.json(
    {
      results: shoes
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300"
      }
    }
  );
}
