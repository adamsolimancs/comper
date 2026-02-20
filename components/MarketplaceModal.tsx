"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { PlatformMarket, TrendWindow } from "@/lib/types";

const TrendChart = dynamic(() => import("@/components/TrendChart").then((mod) => mod.TrendChart), {
  loading: () => <div className="lazy-placeholder">Loading trend chart…</div>,
  ssr: false
});

const SalesTable = dynamic(() => import("@/components/SalesTable").then((mod) => mod.SalesTable), {
  loading: () => <div className="lazy-placeholder">Loading sales history…</div>,
  ssr: false
});

type MarketplaceModalProps = {
  open: boolean;
  market: PlatformMarket | null;
  onClose: () => void;
};

export function MarketplaceModal({ open, market, onClose }: MarketplaceModalProps) {
  const [trendWindow, setTrendWindow] = useState<TrendWindow>(30);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    globalThis.window.addEventListener("keydown", onEscape);
    return () => globalThis.window.removeEventListener("keydown", onEscape);
  }, [onClose, open]);

  if (!open || !market) {
    return null;
  }

  return (
    <>
      <button className="modal-backdrop" onClick={onClose} aria-label="Close marketplace details" />
      <aside className="modal-panel" role="dialog" aria-modal="true" aria-label={`${market.platform} details`}>
        <div className="modal-head">
          <h3>{market.platform} details</h3>
          <button className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <TrendChart points={market.trend90} window={trendWindow} onWindowChange={setTrendWindow} />
        <SalesTable sales={market.recentSales} />
      </aside>
    </>
  );
}
