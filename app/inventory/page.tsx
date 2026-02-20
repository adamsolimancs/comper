import { InventoryClient } from "@/components/InventoryClient";
import { getAllShoesViaFetchCache } from "@/lib/server-data";

export const revalidate = 300;

export default async function InventoryPage() {
  const catalog = await getAllShoesViaFetchCache();
  return <InventoryClient catalog={catalog} />;
}
