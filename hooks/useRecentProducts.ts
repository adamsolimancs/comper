"use client";

import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { ShoeSearchResult } from "@/lib/types";

export function useRecentProducts() {
  const [recentProducts, setRecentProducts, hydrated] = useLocalStorageState<ShoeSearchResult[]>(
    STORAGE_KEYS.recentProducts,
    []
  );

  const addRecentProduct = useCallback(
    (product: ShoeSearchResult) => {
      setRecentProducts((current) => {
        const deduped = current.filter((item) => item.id !== product.id);
        return [product, ...deduped].slice(0, 10);
      });
    },
    [setRecentProducts]
  );

  return {
    recentProducts,
    addRecentProduct,
    hydrated
  };
}
