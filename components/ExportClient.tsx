"use client";

import { useMemo } from "react";

import { PageSearchCard } from "@/components/PageSearchCard";
import { useInventory } from "@/hooks/useInventory";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ShoeSearchResult } from "@/lib/types";

type ExportClientProps = {
  catalog: ShoeSearchResult[];
};

export function ExportClient({ catalog }: ExportClientProps) {
  const { items, hydrated, summary } = useInventory();

  const exportRows = useMemo(() => {
    return items.map((item) => {
      const soldPrice = item.soldPrice ?? 0;
      const profit = soldPrice ? soldPrice - item.purchasePrice : 0;

      return {
        ...item,
        soldPrice,
        profit
      };
    });
  }, [items]);

  if (!hydrated) {
    return <div className="skeleton tall" />;
  }

  return (
    <div className="export-shell print-surface">
      <PageSearchCard catalog={catalog} className="print-hide" />

      <div className="export-head no-print">
        <h1>Inventory export</h1>
        <button className="primary-button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>

      <section className="panel-card print-card">
        <h2>Comper Inventory Report</h2>
        <p className="muted-copy">Generated {new Date().toLocaleString()}</p>
        <div className="summary-grid">
          <div>
            <p className="label">Items</p>
            <p>{summary.totalItems}</p>
          </div>
          <div>
            <p className="label">Total cost</p>
            <p>{formatCurrency(summary.totalCost)}</p>
          </div>
          <div>
            <p className="label">Revenue</p>
            <p>{formatCurrency(summary.totalRevenue)}</p>
          </div>
          <div>
            <p className="label">Realized P/L</p>
            <p>{formatCurrency(summary.realizedProfit)}</p>
          </div>
        </div>
      </section>

      <section className="panel-card print-card">
        <h3>Item detail</h3>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Shoe</th>
              <th>Purchase</th>
              <th>Sale</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {exportRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <p className="table-main">{row.shoeName}</p>
                  <p className="muted-copy">
                    {row.sku} • Size {row.size} • {row.condition}
                  </p>
                </td>
                <td>
                  <p className="table-main">{formatCurrency(row.purchasePrice)}</p>
                  <p className="muted-copy">
                    {row.purchasePlatform} • {formatDate(row.purchaseDate)}
                  </p>
                </td>
                <td>
                  {row.soldPrice ? (
                    <>
                      <p className="table-main">{formatCurrency(row.soldPrice)}</p>
                      <p className="muted-copy">
                        {row.soldPlatform ?? "N/A"} • {row.soldDate ? formatDate(row.soldDate) : "N/A"}
                      </p>
                    </>
                  ) : (
                    <p className="muted-copy">Open</p>
                  )}
                </td>
                <td>
                  {row.soldPrice ? (
                    <p className={row.profit >= 0 ? "profit-copy" : "loss-copy"}>{formatCurrency(row.profit)}</p>
                  ) : (
                    <p className="muted-copy">-</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
