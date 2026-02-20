"use client";

import { useState } from "react";

import { useInventory } from "@/hooks/useInventory";
import type { Condition, Platform, Shoe } from "@/lib/types";

type AddToInventoryProps = {
  shoe: Shoe;
  size: number;
  condition: Condition;
};

const buyPlatforms: Array<Platform | "Local" | "Other"> = [
  "StockX",
  "GOAT",
  "eBay",
  "Flight Club",
  "KicksCrew",
  "Local",
  "Other"
];

export function AddToInventory({ shoe, size, condition }: AddToInventoryProps) {
  const { addItem } = useInventory();
  const [purchasePlatform, setPurchasePlatform] = useState<Platform | "Local" | "Other">("Local");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="panel-card add-inventory-card">
      <h3>Add to inventory</h3>
      <div className="inventory-form-grid">
        <label>
          <span>Purchase platform</span>
          <select
            value={purchasePlatform}
            onChange={(event) =>
              setPurchasePlatform(event.target.value as Platform | "Local" | "Other")
            }
          >
            {buyPlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Purchase price</span>
          <input
            value={purchasePrice}
            onChange={(event) => {
              setPurchasePrice(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            inputMode="numeric"
            placeholder="220"
            aria-invalid={Boolean(error)}
          />
        </label>

        <label>
          <span>Purchase date</span>
          <input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} />
        </label>

        <label className="span-full">
          <span>Notes</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Bulk buyout lot #12"
          />
        </label>
      </div>

      <button
        className="primary-button"
        onClick={() => {
          const rawPrice = purchasePrice.trim();
          if (!rawPrice) {
            setSaved(false);
            setError("Enter a purchase price before saving.");
            return;
          }

          const parsedPrice = Number(rawPrice);
          if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            setSaved(false);
            setError("Enter a valid purchase price greater than 0.");
            return;
          }

          setError(null);
          addItem({
            shoeId: shoe.id,
            shoeName: shoe.name,
            brand: shoe.brand,
            sku: shoe.sku,
            size,
            condition,
            purchasePlatform,
            purchasePrice: parsedPrice,
            purchaseDate: new Date(`${purchaseDate}T12:00:00.000Z`).toISOString(),
            notes: notes.trim() ? notes : undefined
          });

          setSaved(true);
          setPurchasePrice("");
          setNotes("");
          setTimeout(() => setSaved(false), 2200);
        }}
      >
        Save inventory item
      </button>

      <div className="inventory-feedback" aria-live="polite">
        {error ? <p className="error-copy">{error}</p> : null}
        {saved ? <p className="success-copy">Saved to inventory.</p> : null}
      </div>
    </section>
  );
}
