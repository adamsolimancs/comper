export const STORAGE_KEYS = {
  recentProducts: "comper_recent_products_v1",
  inventory: "comper_inventory_v1",
  productPrefs: "comper_product_prefs_v1",
  quickComp: "comper_quick_comp_v1"
} as const;

export function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
