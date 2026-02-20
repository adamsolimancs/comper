"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import type { InventoryItem, Platform } from "@/lib/types";

type InventoryTableProps = {
  items: InventoryItem[];
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  onRemove: (id: string) => void;
};

const sellPlatforms: Array<Platform | "Local" | "Other"> = [
  "StockX",
  "GOAT",
  "eBay",
  "Flight Club",
  "KicksCrew",
  "Local",
  "Other"
];

export function InventoryTable({ items, onUpdate, onRemove }: InventoryTableProps) {
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
                      value={item.soldPlatform ?? ""}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          soldPlatform: event.target.value
                            ? (event.target.value as Platform | "Local" | "Other")
                            : undefined
                        })
                      }
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
                      value={item.soldPrice ?? ""}
                      placeholder="Sold price"
                      onChange={(event) => {
                        const nextValue = event.target.value.trim();
                        const parsed = Number(nextValue);
                        onUpdate(item.id, {
                          soldPrice: nextValue && Number.isFinite(parsed) ? parsed : undefined
                        });
                      }}
                    />

                    <input
                      type="date"
                      value={item.soldDate ? item.soldDate.slice(0, 10) : ""}
                      onChange={(event) => {
                        onUpdate(item.id, {
                          soldDate: event.target.value
                            ? new Date(`${event.target.value}T12:00:00.000Z`).toISOString()
                            : undefined
                        });
                      }}
                    />
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
