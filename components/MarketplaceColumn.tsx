import { formatCurrency } from "@/lib/format";
import type { PlatformMarket } from "@/lib/types";

type MarketplaceColumnProps = {
  data: PlatformMarket;
  onOpen: (platform: string) => void;
  compact?: boolean;
  isLowestBuyNow?: boolean;
};

function platformInitials(name: string): string {
  return name
    .split(" ")
    .map((token) => token.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MarketplaceColumn({
  data,
  onOpen,
  compact = false,
  isLowestBuyNow = false
}: MarketplaceColumnProps) {
  return (
    <button
      className={compact ? "market-col compact" : "market-col"}
      onClick={() => onOpen(data.platform)}
      aria-label={`${data.platform} more details and trend graph`}
    >
      <div className="market-head">
        <span className="market-logo">{platformInitials(data.platform)}</span>
        <span className="market-name">{data.platform}</span>
      </div>
      <div className="market-stats">
        <div>
          <p className="label">Highest bid</p>
          <p className="value">{formatCurrency(data.highestBid)}</p>
        </div>
        <div>
          <p className="label">Buy now</p>
          <p className={isLowestBuyNow ? "value lowest-buy-now" : "value"}>{formatCurrency(data.buyNow)}</p>
        </div>
        <div>
          <p className="label">Last sale</p>
          <p className="value strong">{formatCurrency(data.lastSale)}</p>
        </div>
      </div>
      <p className="market-more">More Details</p>
    </button>
  );
}
