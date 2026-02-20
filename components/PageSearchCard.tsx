"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SearchBar } from "@/components/SearchBar";
import type { ShoeSearchResult } from "@/lib/types";

type PageSearchCardProps = {
  catalog: ShoeSearchResult[];
  className?: string;
};

export function PageSearchCard({ catalog, className }: PageSearchCardProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const cardClassName = className ? `panel-card ${className}` : "panel-card";

  return (
    <section className={cardClassName}>
      <SearchBar
        catalog={catalog}
        query={query}
        onQueryChange={setQuery}
        onSearchCommit={(value) => {
          const trimmed = value.trim();
          if (!trimmed) {
            router.push("/");
            return;
          }

          const normalized = trimmed.toLowerCase();
          const exactMatch = catalog.find((product) => {
            return (
              product.sku.toLowerCase() === normalized ||
              product.id.toLowerCase() === normalized ||
              product.name.toLowerCase() === normalized
            );
          });

          if (exactMatch) {
            router.push(`/product/${exactMatch.id}`);
            return;
          }

          router.push(`/?q=${encodeURIComponent(trimmed)}`);
        }}
        onSelectProduct={(product) => {
          router.push(`/product/${product.id}`);
        }}
      />
    </section>
  );
}
