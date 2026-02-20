import { getShoeById } from "@/data/shoes";
import { createSeededRng } from "@/lib/seed";
import { PLATFORMS } from "@/lib/types";
import type { Condition, MarketSnapshot, Platform, PlatformMarket, TrendPoint } from "@/lib/types";

const PLATFORM_FACTORS: Record<Platform, number> = {
  StockX: 1,
  GOAT: 1.02,
  eBay: 0.96,
  "Flight Club": 1.07,
  KicksCrew: 0.99,
  Poizon: 0.97,
  Alias: 1.01,
  "Stadium Goods": 1.09
};

const BASE_DATE = new Date("2026-02-20T00:00:00.000Z");

function toDollars(value: number): number {
  return Math.max(1, Math.round(value));
}

function generateTrend(seedKey: string, startingPrice: number): TrendPoint[] {
  const rng = createSeededRng(seedKey);
  const points: TrendPoint[] = [];
  let cursor = startingPrice;

  for (let day = 89; day >= 0; day -= 1) {
    const date = new Date(BASE_DATE);
    date.setUTCDate(date.getUTCDate() - day);

    const drift = (rng() - 0.45) * 6;
    const shock = rng() > 0.95 ? (rng() - 0.5) * 28 : 0;
    cursor = Math.max(50, cursor + drift + shock);

    points.push({
      date: date.toISOString(),
      price: toDollars(cursor)
    });
  }

  return points;
}

function generateRecentSales(
  seedKey: string,
  centerPrice: number,
  size: number,
  condition: Condition
): PlatformMarket["recentSales"] {
  const rng = createSeededRng(`${seedKey}-sales`);

  return Array.from({ length: 10 }).map((_, index) => {
    const date = new Date(BASE_DATE);
    date.setUTCDate(date.getUTCDate() - (index * 3 + Math.floor(rng() * 2)));

    const spread = condition === "new" ? 0.09 : 0.14;
    const price = centerPrice * (1 + (rng() - 0.5) * spread * 2);

    return {
      id: `${seedKey}-sale-${index}`,
      date: date.toISOString(),
      price: toDollars(price),
      condition,
      size
    };
  });
}

function platformSnapshot(
  seedBase: string,
  platform: Platform,
  marketBase: number,
  size: number,
  condition: Condition
): PlatformMarket {
  const rng = createSeededRng(`${seedBase}-${platform}`);
  const platformBase = marketBase * PLATFORM_FACTORS[platform] * (0.96 + rng() * 0.08);

  const highestBid = platformBase * (condition === "new" ? 0.93 : 0.88);
  const buyNow = platformBase * (condition === "new" ? 1.04 : 0.98);
  const lastSale = platformBase * (0.97 + rng() * 0.08);

  return {
    platform,
    highestBid: toDollars(highestBid),
    buyNow: toDollars(buyNow),
    lastSale: toDollars(lastSale),
    recentSales: generateRecentSales(seedBase + platform, lastSale, size, condition),
    trend90: generateTrend(seedBase + platform + "trend", lastSale)
  };
}

export function generateMarketSnapshot(
  shoeId: string,
  size: number,
  condition: Condition,
  variant: string
): MarketSnapshot {
  const shoe = getShoeById(shoeId);
  if (!shoe) {
    throw new Error(`Unknown shoe id: ${shoeId}`);
  }

  const seed = `${shoeId}-${size}-${condition}-${variant}`;
  const rng = createSeededRng(seed);
  const sizePremium = 1 + (Math.abs(size - 9) / 30) * 0.7;
  const conditionFactor = condition === "new" ? 1 : 0.72;
  const hypeFactor = 1.15 + rng() * 0.9;

  const marketBase = shoe.retailPrice * sizePremium * conditionFactor * hypeFactor;
  return {
    shoeId,
    size,
    condition,
    variant,
    lastUpdated: BASE_DATE.toISOString(),
    platforms: PLATFORMS.map((platform) => platformSnapshot(seed, platform, marketBase, size, condition))
  };
}
