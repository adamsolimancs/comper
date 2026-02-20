import { clamp } from "@/lib/format";
import type { CompResult, PlatformMarket } from "@/lib/types";

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function standardDeviation(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const avg = average(values);
  const variance = values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function calculateComperComp(platforms: PlatformMarket[]): CompResult {
  const lastSales = platforms
    .map((platform) => platform.lastSale)
    .filter((value) => Number.isFinite(value) && value > 0);
  const buyNowValues = platforms
    .map((platform) => platform.buyNow)
    .filter((value) => Number.isFinite(value) && value > 0);
  const highestBidValues = platforms
    .map((platform) => platform.highestBid)
    .filter((value) => Number.isFinite(value) && value > 0);

  const averageLastSale = Math.round(average(lastSales));
  const medianLastSale = Math.round(median(lastSales));
  const averageBuyNow = Math.round(average(buyNowValues));
  const averageHighestBid = Math.round(average(highestBidValues));

  const sampleSize = lastSales.length;
  const comperComp = averageLastSale;

  if (sampleSize === 0) {
    return {
      comperComp: 0,
      confidence: "Low",
      confidenceScore: 0,
      breakdown: {
        averageLastSale: 0,
        medianLastSale: 0,
        averageBuyNow: 0,
        averageHighestBid: 0,
        sampleSize: 0
      }
    };
  }

  const volatilityCoefficient = standardDeviation(lastSales) / Math.max(average(lastSales), 1);
  const bidAskSpreadPercent =
    Math.max(averageBuyNow - averageHighestBid, 0) / Math.max(averageBuyNow, 1);

  const sampleScore = clamp(sampleSize / 5, 0, 1);
  const volatilityScore = clamp(1 - volatilityCoefficient, 0, 1);
  const spreadScore = clamp(1 - bidAskSpreadPercent, 0, 1);

  const confidenceScore = clamp(sampleScore * 0.45 + volatilityScore * 0.35 + spreadScore * 0.2, 0, 1);
  const confidence = confidenceScore > 0.72 ? "High" : confidenceScore > 0.45 ? "Medium" : "Low";

  return {
    comperComp,
    confidence,
    confidenceScore,
    breakdown: {
      averageLastSale,
      medianLastSale,
      averageBuyNow,
      averageHighestBid,
      sampleSize
    }
  };
}
