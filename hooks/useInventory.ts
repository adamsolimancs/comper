"use client";

import { useMemo } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, uid } from "@/lib/storage";
import type { InventoryItem } from "@/lib/types";

type CreateInventoryItemInput = Omit<InventoryItem, "id" | "createdAt">;

export function useInventory() {
  const [items, setItems, hydrated] = useLocalStorageState<InventoryItem[]>(STORAGE_KEYS.inventory, []);

  const addItem = (input: CreateInventoryItemInput) => {
    const nextItem: InventoryItem = {
      ...input,
      id: uid("inv"),
      createdAt: new Date().toISOString()
    };

    setItems((current) => [nextItem, ...current]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return {
          ...item,
          ...updates,
          id: item.id,
          createdAt: item.createdAt
        };
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const summary = useMemo(() => {
    const totalCost = items.reduce((sum, item) => sum + item.purchasePrice, 0);
    const totalRevenue = items.reduce((sum, item) => sum + (item.soldPrice ?? 0), 0);

    const realizedProfit = items.reduce((sum, item) => {
      if (!item.soldPrice) {
        return sum;
      }
      return sum + (item.soldPrice - item.purchasePrice);
    }, 0);

    const unsoldCount = items.filter((item) => !item.soldPrice).length;

    return {
      totalItems: items.length,
      totalCost,
      totalRevenue,
      realizedProfit,
      unsoldCount,
      soldCount: items.length - unsoldCount
    };
  }, [items]);

  return {
    items,
    hydrated,
    addItem,
    updateItem,
    removeItem,
    summary
  };
}
