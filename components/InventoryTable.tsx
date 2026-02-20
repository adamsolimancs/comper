"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { calculateComperComp } from "@/lib/comp";
import { formatCurrency, formatDate } from "@/lib/format";
import { PLATFORMS } from "@/lib/types";
import type { InventoryItem, MarketSnapshot, Platform } from "@/lib/types";

type InventoryTableProps = {
  items: InventoryItem[];
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  onRemove: (id: string) => void;
};

const sellPlatforms: Array<Platform | "Local" | "Other"> = [...PLATFORMS, "Local", "Other"];

type SellDraft = {
  soldPlatform: string;
  soldPrice: string;
  soldDate: string;
};

function itemToDraft(item: InventoryItem): SellDraft {
  return {
    soldPlatform: item.soldPlatform ?? "",
    soldPrice: item.soldPrice !== undefined ? String(item.soldPrice) : "",
    soldDate: item.soldDate ? item.soldDate.slice(0, 10) : ""
  };
}

export function InventoryTable({ items, onUpdate, onRemove }: InventoryTableProps) {
  const [sellDrafts, setSellDrafts] = useState<Record<string, SellDraft>>({});
  const [avgBuyNowByMarketKey, setAvgBuyNowByMarketKey] = useState<Record<string, number | null>>({});
  const [loadingMarketKeys, setLoadingMarketKeys] = useState<Record<string, boolean>>({});
  const requestedMarketKeysRef = useRef<Set<string>>(new Set());

  const marketLookupItems = useMemo(() => {
    const unique = new Map<
      string,
      {
        shoeId: string;
        size: number;
        condition: InventoryItem["condition"];
      }
    >();

    for (const item of items) {
      const key = `${item.shoeId}:${item.size}:${item.condition}`;
      if (!unique.has(key)) {
        unique.set(key, {
          shoeId: item.shoeId,
          size: item.size,
          condition: item.condition
        });
      }
    }

    return Array.from(unique.entries()).map(([key, value]) => ({
      key,
      ...value
    }));
  }, [items]);

  useEffect(() => {
    const itemIds = new Set(items.map((item) => item.id));
    setSellDrafts((current) => {
      const next: Record<string, SellDraft> = {};
      for (const [id, draft] of Object.entries(current)) {
        if (itemIds.has(id)) {
          next[id] = draft;
        }
      }
      return next;
    });
  }, [items]);

  useEffect(() => {
    const activeMarketKeys = new Set(marketLookupItems.map((entry) => entry.key));
    requestedMarketKeysRef.current = new Set(
      Array.from(requestedMarketKeysRef.current).filter((key) => activeMarketKeys.has(key))
    );

    setAvgBuyNowByMarketKey((current) => {
      const next: Record<string, number | null> = {};

      for (const [key, value] of Object.entries(current)) {
        if (activeMarketKeys.has(key)) {
          next[key] = value;
        }
      }

      return next;
    });

    setLoadingMarketKeys((current) => {
      const next: Record<string, boolean> = {};

      for (const [key, value] of Object.entries(current)) {
        if (activeMarketKeys.has(key)) {
          next[key] = value;
        }
      }

      return next;
    });

    const pendingEntries = marketLookupItems.filter(
      (entry) => !requestedMarketKeysRef.current.has(entry.key)
    );

    if (pendingEntries.length === 0) {
      return;
    }

    for (const entry of pendingEntries) {
      requestedMarketKeysRef.current.add(entry.key);
    }

    setLoadingMarketKeys((current) => {
      const next = { ...current };
      for (const entry of pendingEntries) {
        next[entry.key] = true;
      }
      return next;
    });

    async function loadMarketAverages() {
      const results = await Promise.all(
        pendingEntries.map(async (entry) => {
          try {
            const params = new URLSearchParams({
              size: String(entry.size),
              condition: entry.condition,
              variant: "any",
              schema: `platforms-${PLATFORMS.length}`
            });

            const response = await fetch(`/api/market/${entry.shoeId}?${params.toString()}`, {
              cache: "no-store"
            });

            if (!response.ok) {
              return { key: entry.key, averageBuyNow: null as number | null };
            }

            const snapshot = (await response.json()) as MarketSnapshot;
            const averageBuyNow = calculateComperComp(snapshot.platforms).breakdown.averageBuyNow;

            if (!Number.isFinite(averageBuyNow) || averageBuyNow <= 0) {
              return { key: entry.key, averageBuyNow: null as number | null };
            }

            return { key: entry.key, averageBuyNow };
          } catch {
            return { key: entry.key, averageBuyNow: null as number | null };
          }
        })
      );

      setAvgBuyNowByMarketKey((current) => {
        const next = { ...current };
        for (const result of results) {
          next[result.key] = result.averageBuyNow;
        }
        return next;
      });

      setLoadingMarketKeys((current) => {
        const next = { ...current };
        for (const result of results) {
          delete next[result.key];
        }
        return next;
      });
    }

    loadMarketAverages();
  }, [marketLookupItems]);

  if (items.length === 0) {
    return (
      <div className="empty-state panel-card">
        <h3>No inventory yet</h3>
        <p className="muted-copy">Add items from a product page to start tracking live P/L.</p>
      </div>
    );
  }

  return (
    <div className="inventory-table-wrap panel-card">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Shoe</th>
            <th>Purchase</th>
            <th>Avg market (buy now)</th>
            <th>Sell data</th>
            <th>P/L</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const hasSale = Number.isFinite(item.soldPrice);
            const profit = (item.soldPrice ?? 0) - item.purchasePrice;
            const marketKey = `${item.shoeId}:${item.size}:${item.condition}`;
            const avgBuyNow = avgBuyNowByMarketKey[marketKey];
            const loadingMarket = loadingMarketKeys[marketKey] || avgBuyNow === undefined;
            const baseline = itemToDraft(item);
            const draft = sellDrafts[item.id] ?? baseline;
            const draftDirty =
              draft.soldPlatform !== baseline.soldPlatform ||
              draft.soldPrice !== baseline.soldPrice ||
              draft.soldDate !== baseline.soldDate;

            return (
              <tr key={item.id}>
                <td>
                  <p className="table-main">
                    <Link href={`/product/${item.shoeId}`}>{item.shoeName}</Link>
                  </p>
                  <p className="muted-copy">
                    {item.sku} • Size {item.size} • {item.condition}
                  </p>
                  {item.notes ? <p className="muted-copy">{item.notes}</p> : null}
                </td>
                <td>
                  <p className="table-main">{formatCurrency(item.purchasePrice)}</p>
                  <p className="muted-copy">
                    {item.purchasePlatform} • {formatDate(item.purchaseDate)}
                  </p>
                </td>
                <td>
                  {loadingMarket ? (
                    <p className="muted-copy">Loading...</p>
                  ) : avgBuyNow !== null && avgBuyNow !== undefined ? (
                    <p className="table-main">{formatCurrency(avgBuyNow)}</p>
                  ) : (
                    <p className="muted-copy">Unavailable</p>
                  )}
                </td>
                <td>
                  <div className="sell-fields">
                    <select
                      value={draft.soldPlatform}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setSellDrafts((current) => ({
                          ...current,
                          [item.id]: {
                            ...draft,
                            soldPlatform: nextValue
                          }
                        }));
                      }}
                    >
                      <option value="">Not sold</option>
                      {sellPlatforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>

                    <input
                      inputMode="numeric"
                      value={draft.soldPrice}
                      placeholder="Sold price"
                      onChange={(event) => {
                        setSellDrafts((current) => ({
                          ...current,
                          [item.id]: {
                            ...draft,
                            soldPrice: event.target.value
                          }
                        }));
                      }}
                    />

                    <input
                      type="date"
                      value={draft.soldDate}
                      onChange={(event) => {
                        setSellDrafts((current) => ({
                          ...current,
                          [item.id]: {
                            ...draft,
                            soldDate: event.target.value
                          }
                        }));
                      }}
                    />

                    <button
                      type="button"
                      className="sell-save-button"
                      disabled={!draftDirty}
                      onClick={() => {
                        const priceText = draft.soldPrice.trim();
                        const parsedPrice = Number(priceText);

                        onUpdate(item.id, {
                          soldPlatform: draft.soldPlatform
                            ? (draft.soldPlatform as Platform | "Local" | "Other")
                            : undefined,
                          soldPrice: priceText && Number.isFinite(parsedPrice) ? parsedPrice : undefined,
                          soldDate: draft.soldDate
                            ? new Date(`${draft.soldDate}T12:00:00.000Z`).toISOString()
                            : undefined
                        });

                        setSellDrafts((current) => {
                          const next = { ...current };
                          delete next[item.id];
                          return next;
                        });
                      }}
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td>
                  {hasSale ? (
                    <p className={profit >= 0 ? "profit-copy" : "loss-copy"}>{formatCurrency(profit)}</p>
                  ) : (
                    <p className="muted-copy">Open</p>
                  )}
                </td>
                <td>
                  <button className="danger-link" onClick={() => onRemove(item.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
