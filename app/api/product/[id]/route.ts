import { NextResponse } from "next/server";

import { getShoe } from "@/lib/server-data";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const shoe = await getShoe(id);

  if (!shoe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      product: shoe
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300"
      }
    }
  );
}
