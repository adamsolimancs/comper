"use client";

import { useMemo } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Condition } from "@/lib/types";

type ProductPrefs = {
  [productId: string]: {
    size: number;
    condition: Condition;
    variant: string;
  };
};

export function useProductPrefs(productId: string, fallback: { size: number; condition: Condition; variant: string }) {
  const [prefs, setPrefs, hydrated] = useLocalStorageState<ProductPrefs>(STORAGE_KEYS.productPrefs, {});

  const value = useMemo(() => prefs[productId] ?? fallback, [fallback, prefs, productId]);

  const setValue = (next: { size: number; condition: Condition; variant: string }) => {
    setPrefs((current) => ({
      ...current,
      [productId]: next
    }));
  };

  return {
    value,
    setValue,
    hydrated
  };
}

export function useQuickCompMode() {
  const [enabled, setEnabled, hydrated] = useLocalStorageState<boolean>(STORAGE_KEYS.quickComp, false);

  return {
    enabled,
    setEnabled,
    hydrated
  };
}
