import { NextResponse } from "next/server";

import { getShoe } from "@/lib/server-data";
import { getMarketSnapshot } from "@/lib/market-service";
import type { Condition } from "@/lib/types";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const shoe = await getShoe(id);

  if (!shoe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const sizeParam = Number(url.searchParams.get("size") ?? shoe.availableSizes[0]);
  const size = shoe.availableSizes.includes(sizeParam) ? sizeParam : shoe.availableSizes[0];

  const conditionParam = (url.searchParams.get("condition") ?? "new").toLowerCase();
  const condition: Condition = conditionParam === "used" ? "used" : "new";

  const variantParam = url.searchParams.get("variant") ?? shoe.variants[0];
  const variant = shoe.variants.includes(variantParam) ? variantParam : shoe.variants[0];

  const snapshot = await getMarketSnapshot(id, size, condition, variant);

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60"
    }
  });
}
