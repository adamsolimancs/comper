"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import type { Shoe } from "@/lib/types";

type HomeSearchClientProps = {
  catalog: Shoe[];
  initialQuery?: string;
};

export function HomeSearchClient({ catalog, initialQuery = "" }: HomeSearchClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const { recentProducts, hydrated } = useRecentProducts();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return catalog.slice(0, 18);
    }

    return catalog
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(normalized) ||
          product.brand.toLowerCase().includes(normalized) ||
          product.sku.toLowerCase().includes(normalized) ||
          product.colorway.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 30);
  }, [catalog, query]);

  return (
    <div className="home-shell">
      <section className="hero-card panel-card">
        <div>
          <p className="eyebrow">Cross-market sneaker pricing</p>
          <h1>Comp faster, buy cleaner, scale margins.</h1>
          <p className="muted-copy">
            Search once and compare live-like comps from StockX, GOAT, eBay, Flight Club, KicksCrew, Poizon,
            Alias, and Stadium Goods.
          </p>
        </div>

        <SearchBar
          catalog={catalog}
          query={query}
          onQueryChange={setQuery}
          onSearchCommit={(value) => {
            router.replace(value.trim() ? `/?q=${encodeURIComponent(value.trim())}` : "/");
          }}
          onSelectProduct={(product) => {
            router.push(`/product/${product.id}`);
          }}
        />
      </section>

      {hydrated && recentProducts.length > 0 ? (
        <section className="panel-card">
          <div className="panel-head">
            <h2>Recently viewed</h2>
          </div>
          <div className="recent-row">
            {recentProducts.slice(0, 5).map((product) => (
              <button
                key={product.id}
                className="recent-pill"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <span>{product.name}</span>
                <span className="sku-inline">{product.sku}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="panel-head">
          <h2>{query.trim() ? `Results (${results.length})` : "Trending pairs"}</h2>
        </div>
        <div className="results-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
