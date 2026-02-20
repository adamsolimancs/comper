"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AddToInventory } from "@/components/AddToInventory";
import { CompSummary } from "@/components/CompSummary";
import { MarketplaceColumn } from "@/components/MarketplaceColumn";
import { MarketplaceModal } from "@/components/MarketplaceModal";
import { QuickCompToggle } from "@/components/QuickCompToggle";
import { useProductPrefs, useQuickCompMode } from "@/hooks/useProductPrefs";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import { calculateComperComp } from "@/lib/comp";
import { formatCurrency, formatDate } from "@/lib/format";
import { shouldZoomOutShoeImage } from "@/lib/image-presentation";
import { PLATFORMS } from "@/lib/types";
import type { Condition, MarketSnapshot, PlatformMarket, Shoe } from "@/lib/types";

type ProductCompClientProps = {
  shoe: Shoe;
  catalog: Shoe[];
};

const ANY_VARIANT = "any";

function normalizeSelection(
  current: { size: number; condition: Condition; variant: string },
  shoe: Shoe
): { size: number; condition: Condition; variant: string } {
  return {
    size: shoe.availableSizes.includes(current.size) ? current.size : shoe.availableSizes[0],
    condition: current.condition,
    variant:
      current.variant === ANY_VARIANT || shoe.variants.includes(current.variant)
        ? current.variant
        : shoe.variants[0]
  };
}

export function ProductCompClient({ shoe, catalog }: ProductCompClientProps) {
  const router = useRouter();
  const fallback = useMemo(
    () => ({ size: shoe.availableSizes[0], condition: "new" as Condition, variant: shoe.variants[0] }),
    [shoe.availableSizes, shoe.variants]
  );

  const { value: storedSelection, setValue: setStoredSelection } = useProductPrefs(shoe.id, fallback);
  const selection = normalizeSelection(storedSelection, shoe);

  const { enabled: quickCompMode, setEnabled: setQuickCompMode } = useQuickCompMode();
  const { addRecentProduct } = useRecentProducts();

  const [marketSnapshot, setMarketSnapshot] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMarket, setActiveMarket] = useState<PlatformMarket | null>(null);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupOpen, setLookupOpen] = useState(false);

  useEffect(() => {
    addRecentProduct({
      id: shoe.id,
      name: shoe.name,
      brand: shoe.brand,
      sku: shoe.sku,
      colorway: shoe.colorway,
      retailPrice: shoe.retailPrice,
      images: shoe.images
    });
  }, [addRecentProduct, shoe]);

  useEffect(() => {
    let canceled = false;

    async function loadMarket() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          size: String(selection.size),
          condition: selection.condition,
          variant: selection.variant,
          schema: `platforms-${PLATFORMS.length}`
        });

        const response = await fetch(`/api/market/${shoe.id}?${params.toString()}`, {
          cache: "force-cache"
        });

        if (!response.ok) {
          throw new Error("Unable to load market comps");
        }

        const payload = (await response.json()) as MarketSnapshot;
        if (!canceled) {
          setMarketSnapshot(payload);
        }
      } catch (loadError) {
        if (!canceled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load market data");
          setMarketSnapshot(null);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    loadMarket();

    return () => {
      canceled = true;
    };
  }, [selection.condition, selection.size, selection.variant, shoe.id]);

  const comp = useMemo(() => {
    return calculateComperComp(marketSnapshot?.platforms ?? []);
  }, [marketSnapshot]);
  const zoomOutImage = shouldZoomOutShoeImage(shoe.sku);
  const lowestBuyNow = useMemo(() => {
    const buyNowValues =
      marketSnapshot?.platforms
        .map((platform) => platform.buyNow)
        .filter((value) => Number.isFinite(value) && value > 0) ?? [];

    if (buyNowValues.length === 0) {
      return null;
    }

    return Math.min(...buyNowValues);
  }, [marketSnapshot]);

  const lookupSuggestions = useMemo(() => {
    const normalized = lookupQuery.trim().toLowerCase();
    const pool = catalog.filter((product) => product.id !== shoe.id);

    if (!normalized) {
      return pool.slice(0, 8);
    }

    return pool
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(normalized) ||
          product.brand.toLowerCase().includes(normalized) ||
          product.sku.toLowerCase().includes(normalized) ||
          product.colorway.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 8);
  }, [catalog, lookupQuery, shoe.id]);

  const goToLookup = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return;
    }

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

    const firstMatch = catalog.find((product) => {
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.brand.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized) ||
        product.colorway.toLowerCase().includes(normalized)
      );
    });

    if (firstMatch) {
      router.push(`/product/${firstMatch.id}`);
      return;
    }

    router.push(`/?q=${encodeURIComponent(value.trim())}`);
  };

  const renderLookupCard = (modeClassName: "product-lookup-mobile" | "product-lookup-desktop") => (
    <section className={`panel-card product-lookup ${modeClassName}`}>
      <form
        className="product-lookup-form"
        onSubmit={(event) => {
          event.preventDefault();
          goToLookup(lookupQuery);
          setLookupOpen(false);
        }}
      >
        <input
          className="product-lookup-input"
          placeholder="Find another shoe by name, SKU, or brand"
          value={lookupQuery}
          onChange={(event) => {
            setLookupQuery(event.target.value);
            setLookupOpen(true);
          }}
          onFocus={() => setLookupOpen(true)}
          onBlur={() => window.setTimeout(() => setLookupOpen(false), 120)}
          aria-label="Search shoes from product page"
        />
        <button className="ghost-button" type="submit">
          Go
        </button>
      </form>
      {lookupOpen ? (
        <div className="product-lookup-list">
          {lookupSuggestions.length === 0 ? <p className="muted-copy">No matches</p> : null}
          {lookupSuggestions.map((product) => (
            <button
              key={product.id}
              className="product-lookup-item"
              type="button"
              onClick={() => {
                router.push(`/product/${product.id}`);
                setLookupOpen(false);
              }}
            >
              <span>{product.name}</span>
              <span className="sku-inline">{product.sku}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );

  return (
    <div className={quickCompMode ? "product-layout quick" : "product-layout"}>
      {renderLookupCard("product-lookup-mobile")}

      <aside className="product-card panel-card sticky">
        <div className="product-image-wrap large">
          <Image
            src={shoe.images[0] ?? "/shoe-placeholder.png"}
            alt={shoe.name}
            fill
            sizes="480px"
            priority
            className={zoomOutImage ? "image-zoom-out" : undefined}
          />
        </div>
        <p className="product-brand">{shoe.brand}</p>
        <h1 className="product-title">{shoe.name}</h1>
        <p className="muted-copy">{shoe.sku}</p>

        <div className="meta-grid">
          <div>
            <p className="label">Retail</p>
            <p>{formatCurrency(shoe.retailPrice)}</p>
          </div>
          <div>
            <p className="label">Release</p>
            <p>{formatDate(shoe.releaseDate)}</p>
          </div>
        </div>

        <div className="controls-grid">
          <label>
            <span>Size</span>
            <select
              value={selection.size}
              onChange={(event) =>
                setStoredSelection({
                  ...selection,
                  size: Number(event.target.value)
                })
              }
            >
              {shoe.availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Condition</span>
            <select
              value={selection.condition}
              onChange={(event) =>
                setStoredSelection({
                  ...selection,
                  condition: event.target.value as Condition
                })
              }
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </label>

          <label>
            <span>Variant</span>
            <select
              value={selection.variant}
              onChange={(event) =>
                setStoredSelection({
                  ...selection,
                  variant: event.target.value
                })
              }
            >
              <option value={ANY_VARIANT}>Any</option>
              {shoe.variants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </label>
        </div>

        <QuickCompToggle enabled={quickCompMode} onChange={setQuickCompMode} />

        <div className="add-inventory-desktop">
          <AddToInventory shoe={shoe} size={selection.size} condition={selection.condition} />
        </div>
      </aside>

      <section className="product-main">
        {renderLookupCard("product-lookup-desktop")}

        <div className="panel-head">
          <h2>Marketplace comps ({marketSnapshot?.platforms.length ?? PLATFORMS.length})</h2>
        </div>

        {loading ? (
          <div className={quickCompMode ? "market-grid quick" : "market-grid"}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="skeleton market" key={`market-skeleton-${index}`} />
            ))}
          </div>
        ) : null}

        {error ? <p className="error-copy">{error}</p> : null}

        {!loading && marketSnapshot ? (
          <div className={quickCompMode ? "market-grid quick" : "market-grid"}>
            {marketSnapshot.platforms.map((market) => (
              <MarketplaceColumn
                key={market.platform}
                data={market}
                onOpen={() => setActiveMarket(market)}
                compact={quickCompMode}
                isLowestBuyNow={lowestBuyNow !== null && market.buyNow === lowestBuyNow}
              />
            ))}
          </div>
        ) : null}

        {!loading && marketSnapshot ? <CompSummary comp={comp} lastUpdated={marketSnapshot.lastUpdated} /> : null}

        <div className="add-inventory-mobile">
          <AddToInventory shoe={shoe} size={selection.size} condition={selection.condition} />
        </div>
      </section>

      <MarketplaceModal open={Boolean(activeMarket)} market={activeMarket} onClose={() => setActiveMarket(null)} />
    </div>
  );
}
