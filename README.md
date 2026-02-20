# Comper

Demo-quality Next.js mock web app for sneaker resellers and buyers to comp prices across StockX, GOAT, eBay, Flight Club, KicksCrew, Poizon, Alias, and Stadium Goods.

## Stack

- Next.js App Router
- TypeScript
- Mock deterministic data (no DB, no external APIs)
- LocalStorage persistence for recent products, product prefs, and inventory

## Features

- Global search with autocomplete (name, SKU, brand, colorway)
- Simulated scan flows: `Scan box label` and `Scan shoe`
- Product comping view with size, condition, and variant selectors
- Marketplace columns: highest bid, buy now, last sale
- Lazy-loaded marketplace side panel with:
  - 10 most recent sales
  - 30/60/90 trend chart
- Comper Comp average + confidence + methodology breakdown
- Quick Comp Mode toggle for condensed high-speed comping
- Inventory management with per-item and total P/L
- Print-friendly export route for PDF save (`/export`)

## Caching and Performance Patterns

- Route segment revalidation on home/product/api routes (`revalidate`)
- Server-side data memoization via `unstable_cache`
- In-memory TTL cache for market snapshots (`lib/cache.ts` + `lib/market-service.ts`)
- React memoization for expensive derived calculations (`useMemo`)
- Deferred heavy UI via dynamic imports in `MarketplaceModal`
- LocalStorage caches:
  - recently viewed products
  - product size/condition/variant preferences
  - inventory list and quick-comp preference
- Skeleton loading states for perceived speed

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

Optional: set `NEXT_PUBLIC_APP_URL=http://localhost:3000` to force home-page server fetch caching through `/api/search-index`.

## Routes

- `/` search + lookup
- `/product/[id]` product detail and comping
- `/inventory` inventory management
- `/export` print-friendly inventory report
- `/settings` stubbed settings page

## Project Structure

```text
app/
  api/
    market/[id]/route.ts
    product/[id]/route.ts
    search/route.ts
    search-index/route.ts
  export/page.tsx
  inventory/page.tsx
  product/[id]/page.tsx
  settings/page.tsx
  layout.tsx
  page.tsx
components/
  AddToInventory.tsx
  CompSummary.tsx
  ExportClient.tsx
  HomeSearchClient.tsx
  InventoryClient.tsx
  InventoryTable.tsx
  MarketplaceColumn.tsx
  MarketplaceModal.tsx
  ProductCard.tsx
  ProductCompClient.tsx
  QuickCompToggle.tsx
  SalesTable.tsx
  SearchBar.tsx
  TrendChart.tsx
data/
  market-data.ts
  shoes.ts
hooks/
  useInventory.ts
  useLocalStorage.ts
  useProductPrefs.ts
  useRecentProducts.ts
lib/
  cache.ts
  comp.ts
  format.ts
  market-service.ts
  seed.ts
  server-data.ts
  storage.ts
  types.ts
```
