"use client";

import { useMemo, useRef, useState } from "react";

import { hashString } from "@/lib/seed";
import type { ShoeSearchResult } from "@/lib/types";

type SearchBarProps = {
  catalog: ShoeSearchResult[];
  query: string;
  onQueryChange: (value: string) => void;
  onSearchCommit: (value: string) => void;
  onSelectProduct: (product: ShoeSearchResult) => void;
};

type ScanMode = "box" | "shoe";

export function SearchBar({
  catalog,
  query,
  onQueryChange,
  onSearchCommit,
  onSelectProduct
}: SearchBarProps) {
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const boxInputRef = useRef<HTMLInputElement | null>(null);
  const shoeInputRef = useRef<HTMLInputElement | null>(null);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return catalog.slice(0, 6);
    }

    return catalog
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(normalized) ||
          product.brand.toLowerCase().includes(normalized) ||
          product.sku.toLowerCase().includes(normalized) ||
          product.colorway.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 8);
  }, [catalog, query]);

  const runScan = (mode: ScanMode, file: File | null) => {
    if (!file || catalog.length === 0) {
      return;
    }

    const hash = hashString(`${mode}:${file.name}:${file.size}`);
    const product = catalog[hash % catalog.length];

    setScanMessage(`Parsed ${mode === "box" ? "box label" : "shoe"} -> SKU ${product.sku}`);
    onQueryChange(product.sku);
    onSelectProduct(product);
  };

  return (
    <div className="search-shell">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearchCommit(query);
          setOpenSuggestions(false);
        }}
        className="search-form"
      >
        <input
          className="search-input"
          placeholder="Search by name, SKU, brand"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpenSuggestions(true);
          }}
          onFocus={() => setOpenSuggestions(true)}
          onBlur={() => {
            window.setTimeout(() => setOpenSuggestions(false), 120);
          }}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      {openSuggestions ? (
        <div className="autocomplete-panel">
          {suggestions.length === 0 ? <p className="muted-copy">No matches</p> : null}
          {suggestions.map((product) => (
            <button
              key={product.id}
              className="autocomplete-item"
              onClick={() => {
                onSelectProduct(product);
                setOpenSuggestions(false);
              }}
            >
              <span>{product.name}</span>
              <span className="sku-inline">{product.sku}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="scan-row">
        <button
          className="ghost-button"
          onClick={() => boxInputRef.current?.click()}
          type="button"
        >
          Scan box label
        </button>
        <button
          className="ghost-button"
          onClick={() => shoeInputRef.current?.click()}
          type="button"
        >
          Scan shoe
        </button>
        <input
          ref={boxInputRef}
          className="hidden-input"
          type="file"
          accept="image/*"
          onChange={(event) => runScan("box", event.target.files?.[0] ?? null)}
        />
        <input
          ref={shoeInputRef}
          className="hidden-input"
          type="file"
          accept="image/*"
          onChange={(event) => runScan("shoe", event.target.files?.[0] ?? null)}
        />
      </div>

      {scanMessage ? <p className="scan-message">{scanMessage}</p> : null}
    </div>
  );
}
