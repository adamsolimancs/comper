import { HomeSearchClient } from "@/components/HomeSearchClient";
import { getAllShoesViaFetchCache } from "@/lib/server-data";

export const revalidate = 600;

type HomePageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const catalog = await getAllShoesViaFetchCache();

  return <HomeSearchClient catalog={catalog} initialQuery={resolvedSearchParams?.q ?? ""} />;
}
