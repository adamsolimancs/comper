import { clamp } from "@/lib/format";
import type { CompResult, Platform, PlatformMarket } from "@/lib/types";

function percentile(values: number[], p: number): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sorted[lower];
  }

  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function calculateComperComp(platforms: PlatformMarket[]): CompResult {
  const allRecentSales = platforms.flatMap((platform) =>
    platform.recentSales.map((sale) => ({ platform: platform.platform, price: sale.price }))
  );

  if (allRecentSales.length === 0) {
    return {
      comperComp: 0,
      confidence: "Low",
      confidenceScore: 0,
      breakdown: {
        trimmedMean: 0,
        median: 0,
        weightedMean: 0,
        sampleSize: 0,
        outliersRemoved: 0,
        platformWeights: platforms.map((platform) => ({ platform: platform.platform, weight: 0 }))
      }
    };
  }

  const prices = allRecentSales.map((sale) => sale.price);
  const low = percentile(prices, 0.1);
  const high = percentile(prices, 0.9);
  const trimmed = allRecentSales.filter((sale) => sale.price >= low && sale.price <= high);

  const trimmedMean =
    trimmed.reduce((accumulator, sale) => accumulator + sale.price, 0) /
    Math.max(trimmed.length, 1);

  const med = median(prices);

  const perPlatform = new Map<Platform, { volume: number; avg: number }>();
  for (const platform of platforms) {
    const values = platform.recentSales.map((sale) => sale.price);
    const avg = values.reduce((accumulator, value) => accumulator + value, 0) / Math.max(values.length, 1);
    perPlatform.set(platform.platform, { volume: values.length, avg });
  }

  const totalVolume = Array.from(perPlatform.values()).reduce(
    (accumulator, platform) => accumulator + platform.volume,
    0
  );

  const platformWeights = Array.from(perPlatform.entries()).map(([platform, data]) => ({
    platform,
    weight: data.volume / Math.max(totalVolume, 1)
  }));

  const weightedMean = platformWeights.reduce((accumulator, entry) => {
    const platform = perPlatform.get(entry.platform);
    if (!platform) {
      return accumulator;
    }
    return accumulator + entry.weight * platform.avg;
  }, 0);

  const volatility =
    prices.reduce((accumulator, value) => accumulator + Math.pow(value - trimmedMean, 2), 0) /
    Math.max(prices.length, 1);

  const volatilityScore = clamp(1 - Math.sqrt(volatility) / Math.max(trimmedMean, 1), 0, 1);
  const sampleScore = clamp(prices.length / 60, 0, 1);
  const confidenceScore = clamp(volatilityScore * 0.55 + sampleScore * 0.45, 0, 1);

  const confidence = confidenceScore > 0.72 ? "High" : confidenceScore > 0.45 ? "Medium" : "Low";

  const comperComp = Math.round(trimmedMean * 0.5 + med * 0.25 + weightedMean * 0.25);

  return {
    comperComp,
    confidence,
    confidenceScore,
    breakdown: {
      trimmedMean: Math.round(trimmedMean),
      median: Math.round(med),
      weightedMean: Math.round(weightedMean),
      sampleSize: prices.length,
      outliersRemoved: prices.length - trimmed.length,
      platformWeights: platformWeights.map((entry) => ({
        platform: entry.platform,
        weight: Number(entry.weight.toFixed(2))
      }))
    }
  };
}
