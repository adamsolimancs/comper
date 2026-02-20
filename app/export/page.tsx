import { ExportClient } from "@/components/ExportClient";
import { getAllShoesViaFetchCache } from "@/lib/server-data";

export const revalidate = 300;

export default async function ExportPage() {
  const catalog = await getAllShoesViaFetchCache();
  return <ExportClient catalog={catalog} />;
}
