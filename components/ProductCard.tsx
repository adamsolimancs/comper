import Image from "next/image";
import Link from "next/link";

import { formatCurrency, formatDate } from "@/lib/format";
import type { ShoeSearchResult } from "@/lib/types";

type ProductCardProps = {
  product: ShoeSearchResult & { releaseDate?: string };
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className={compact ? "product-card compact" : "product-card"}>
      <div className="product-image-wrap">
        <Image src={product.images[0] ?? "/shoe-placeholder.png"} alt={product.name} fill sizes="320px" />
      </div>
      <div className="product-copy">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-sku">SKU: {product.sku}</p>
        {product.releaseDate ? <p className="product-meta">Release: {formatDate(product.releaseDate)}</p> : null}
        <p className="product-price">Retail {formatCurrency(product.retailPrice)}</p>
      </div>
    </Link>
  );
}
