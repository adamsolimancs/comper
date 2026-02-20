import { notFound } from "next/navigation";

import { ProductCompClient } from "@/components/ProductCompClient";
import { getAllShoes, getShoe } from "@/lib/server-data";

export const revalidate = 300;

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const allShoes = await getAllShoes();
  return allShoes.slice(0, 40).map((shoe) => ({ id: shoe.id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const shoe = await getShoe(id);

  if (!shoe) {
    notFound();
  }

  return <ProductCompClient shoe={shoe} />;
}
