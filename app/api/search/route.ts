import { NextResponse } from "next/server";

import { searchShoesCached } from "@/lib/server-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limit = Math.max(1, Math.min(60, Number(searchParams.get("limit") ?? "24")));

  const matches = await searchShoesCached(query);

  return NextResponse.json(
    {
      results: matches.slice(0, limit)
    },
    {
      headers: {
        "Cache-Control": "public, max-age=120, s-maxage=120"
      }
    }
  );
}
