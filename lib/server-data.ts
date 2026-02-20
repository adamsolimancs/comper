import { unstable_cache } from "next/cache";

import { getShoeById, searchShoes, shoes } from "@/data/shoes";
import type { Shoe } from "@/lib/types";

const getAllShoesCached = unstable_cache(
  async (): Promise<Shoe[]> => {
    return shoes;
  },
  ["all-shoes"],
  { revalidate: 60 * 30 }
);

const getShoeByIdCachedFactory = unstable_cache(
  async (id: string): Promise<Shoe | undefined> => {
    return getShoeById(id);
  },
  ["shoe-by-id"],
  { revalidate: 60 * 30 }
);

const searchShoesCachedFactory = unstable_cache(
  async (query: string): Promise<Shoe[]> => {
    return searchShoes(query);
  },
  ["shoe-search"],
  { revalidate: 60 * 15 }
);

export async function getAllShoes(): Promise<Shoe[]> {
  return getAllShoesCached();
}

export async function getAllShoesViaFetchCache(): Promise<Shoe[]> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return getAllShoesCached();
  }

  try {
    const response = await fetch(`${appUrl}/api/search-index`, {
      cache: "force-cache",
      next: { revalidate: 60 * 10 }
    });

    if (!response.ok) {
      return getAllShoesCached();
    }

    const payload = (await response.json()) as { results: Shoe[] };
    return payload.results;
  } catch {
    return getAllShoesCached();
  }
}

export async function getShoe(id: string): Promise<Shoe | undefined> {
  return getShoeByIdCachedFactory(id);
}

export async function searchShoesCached(query: string): Promise<Shoe[]> {
  return searchShoesCachedFactory(query);
}
