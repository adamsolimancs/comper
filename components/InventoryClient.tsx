"use client";

import Link from "next/link";

import { InventoryTable } from "@/components/InventoryTable";
import { useInventory } from "@/hooks/useInventory";
import { formatCurrency } from "@/lib/format";

export function InventoryClient() {
  const { items, hydrated, summary, updateItem, removeItem } = useInventory();

  if (!hydrated) {
    return <div className="skeleton tall" />;
  }

  return (
    <div className="inventory-shell">
      <section className="summary-cards">
        <article className="panel-card">
          <p className="label">Total items</p>
          <p className="stat-value">{summary.totalItems}</p>
        </article>

        <article className="panel-card">
          <p className="label">Capital deployed</p>
          <p className="stat-value">{formatCurrency(summary.totalCost)}</p>
        </article>

        <article className="panel-card">
          <p className="label">Realized profit</p>
          <p className={summary.realizedProfit >= 0 ? "stat-value profit" : "stat-value loss"}>
            {formatCurrency(summary.realizedProfit)}
          </p>
        </article>

        <article className="panel-card">
          <p className="label">Inventory status</p>
          <p className="stat-value">{summary.unsoldCount} open</p>
        </article>
      </section>

      <div className="inventory-head">
        <h1>Inventory</h1>
        <Link href="/export" className="primary-button">
          Open export view
        </Link>
      </div>

      <InventoryTable items={items} onUpdate={updateItem} onRemove={removeItem} />
    </div>
  );
}
