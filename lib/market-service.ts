import { generateMarketSnapshot } from "@/data/market-data";
import { getOrSetCache } from "@/lib/cache";
import type { Condition, MarketSnapshot } from "@/lib/types";

const MARKET_TTL_MS = 1000 * 60 * 5;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getMarketSnapshot(
  shoeId: string,
  size: number,
  condition: Condition,
  variant: string
): Promise<MarketSnapshot> {
  const cacheKey = `market:${shoeId}:${size}:${condition}:${variant}`;

  const { value, createdAt, cacheHit } = await getOrSetCache(cacheKey, MARKET_TTL_MS, async () => {
    await wait(220);
    return generateMarketSnapshot(shoeId, size, condition, variant);
  });

  const snapshot = value as MarketSnapshot;

  return {
    ...snapshot,
    lastUpdated: new Date(createdAt).toISOString(),
    platforms: snapshot.platforms.map((platform) => {
      if (cacheHit) {
        return platform;
      }

      return {
        ...platform,
        highestBid: platform.highestBid,
        buyNow: platform.buyNow,
        lastSale: platform.lastSale
      };
    })
  };
}
