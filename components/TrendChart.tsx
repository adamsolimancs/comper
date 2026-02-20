"use client";

import { useMemo } from "react";

import { formatCurrency, formatShortDate } from "@/lib/format";
import type { TrendPoint, TrendWindow } from "@/lib/types";

type TrendChartProps = {
  points: TrendPoint[];
  window: TrendWindow;
  onWindowChange: (window: TrendWindow) => void;
};

const WIDTH = 520;
const HEIGHT = 180;

export function TrendChart({ points, window, onWindowChange }: TrendChartProps) {
  const sliced = points.slice(-window);

  const { pathData, min, max, latest, earliest } = useMemo(() => {
    if (sliced.length === 0) {
      return {
        pathData: "",
        min: 0,
        max: 0,
        latest: undefined,
        earliest: undefined
      };
    }

    const values = sliced.map((point) => point.price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);

    const pathData = sliced
      .map((point, index) => {
        const x = (index / Math.max(sliced.length - 1, 1)) * WIDTH;
        const y = HEIGHT - ((point.price - min) / range) * HEIGHT;
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    return {
      pathData,
      min,
      max,
      latest: sliced[sliced.length - 1],
      earliest: sliced[0]
    };
  }, [sliced]);

  return (
    <section className="panel-card">
      <div className="trend-head">
        <h4>Price trend</h4>
        <div className="window-toggles" role="tablist" aria-label="Trend window">
          {[30, 60, 90].map((value) => (
            <button
              key={value}
              className={window === value ? "window-toggle active" : "window-toggle"}
              onClick={() => onWindowChange(value as TrendWindow)}
            >
              {value}d
            </button>
          ))}
        </div>
      </div>

      <div className="trend-summary">
        <span>{earliest ? `${formatShortDate(earliest.date)} ${formatCurrency(earliest.price)}` : "-"}</span>
        <span>{latest ? `${formatShortDate(latest.date)} ${formatCurrency(latest.price)}` : "-"}</span>
      </div>

      <svg className="trend-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-label="Price trend">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(80,196,255,0.75)" />
            <stop offset="100%" stopColor="rgba(80,196,255,0.02)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="transparent" />
        {pathData ? (
          <>
            <path d={`${pathData} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill="url(#trendGradient)" opacity="0.25" />
            <path d={pathData} fill="none" stroke="#5ec8ff" strokeWidth="2" />
          </>
        ) : null}
      </svg>

      <p className="muted-copy">
        Range {formatCurrency(min)} to {formatCurrency(max)}
      </p>
    </section>
  );
}
