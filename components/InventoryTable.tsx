"use client";

import { useEffect, useState } from "react";

import { formatCurrency, formatDate } from "@/lib/format";
import { PLATFORMS } from "@/lib/types";
import type { InventoryItem, Platform } from "@/lib/types";

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
            <th>Sell data</th>
            <th>P/L</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const hasSale = Number.isFinite(item.soldPrice);
            const profit = (item.soldPrice ?? 0) - item.purchasePrice;
            const baseline = itemToDraft(item);
            const draft = sellDrafts[item.id] ?? baseline;
            const draftDirty =
              draft.soldPlatform !== baseline.soldPlatform ||
              draft.soldPrice !== baseline.soldPrice ||
              draft.soldDate !== baseline.soldDate;

            return (
              <tr key={item.id}>
                <td>
                  <p className="table-main">{item.shoeName}</p>
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
