"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import type { RecentSale } from "@/lib/types";

type SalesTableProps = {
  sales: RecentSale[];
};

export function SalesTable({ sales }: SalesTableProps) {
  return (
    <section className="panel-card">
      <h4>Recent sales (10)</h4>
      <div className="sales-table-wrap">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{formatDate(sale.date)}</td>
                <td>{formatCurrency(sale.price)}</td>
                <td>{sale.condition}</td>
                <td>{sale.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
