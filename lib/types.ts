export const PLATFORMS = ["StockX", "GOAT", "eBay", "Flight Club", "KicksCrew"] as const;

export type Platform = (typeof PLATFORMS)[number];

export type Condition = "new" | "used";

export type TrendWindow = 30 | 60 | 90;

export type Shoe = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  colorway: string;
  releaseDate: string;
  retailPrice: number;
  images: string[];
  availableSizes: number[];
  variants: string[];
};

export type ShoeSearchResult = Pick<
  Shoe,
  "id" | "name" | "brand" | "sku" | "colorway" | "retailPrice" | "images"
>;

export type RecentSale = {
  id: string;
  date: string;
  price: number;
  condition: Condition;
  size: number;
};

export type TrendPoint = {
  date: string;
  price: number;
};

export type PlatformMarket = {
  platform: Platform;
  highestBid: number;
  buyNow: number;
  lastSale: number;
  recentSales: RecentSale[];
  trend90: TrendPoint[];
};

export type MarketSnapshot = {
  shoeId: string;
  size: number;
  condition: Condition;
  variant: string;
  lastUpdated: string;
  platforms: PlatformMarket[];
};

export type CompBreakdown = {
  trimmedMean: number;
  median: number;
  weightedMean: number;
  sampleSize: number;
  outliersRemoved: number;
  platformWeights: Array<{ platform: Platform; weight: number }>;
};

export type CompResult = {
  comperComp: number;
  confidence: "Low" | "Medium" | "High";
  confidenceScore: number;
  breakdown: CompBreakdown;
};

export type InventoryItem = {
  id: string;
  shoeId: string;
  shoeName: string;
  brand: string;
  sku: string;
  size: number;
  condition: Condition;
  purchasePlatform: Platform | "Local" | "Other";
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
  soldPlatform?: Platform | "Local" | "Other";
  soldPrice?: number;
  soldDate?: string;
  createdAt: string;
};
