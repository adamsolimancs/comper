import { formatCurrency } from "@/lib/format";
import type { CompResult } from "@/lib/types";

type CompSummaryProps = {
  comp: CompResult;
  lastUpdated: string;
};

export function CompSummary({ comp, lastUpdated }: CompSummaryProps) {
  return (
    <section className="comp-summary panel-card">
      <div className="summary-head">
        <div>
          <p className="label">
            Comper Comp{" "}
            <span
              className="tooltip-mark"
              title="Based on the visible marketplace last-sale prices above. Comper Comp equals their simple average."
            >
              ⓘ
            </span>
          </p>
          <p className="comp-value">{formatCurrency(comp.comperComp)}</p>
        </div>
        <div className={`confidence ${comp.confidence.toLowerCase()}`}>
          <span className="dot" />
          {comp.confidence} confidence
        </div>
      </div>

      <p className="muted-copy">
        Computed directly from the marketplace values shown above for this size, condition, and variant.
      </p>

      <div className="summary-grid">
        <div>
          <p className="label">Average last sale</p>
          <p>{formatCurrency(comp.breakdown.averageLastSale)}</p>
        </div>
        <div>
          <p className="label">Median last sale</p>
          <p>{formatCurrency(comp.breakdown.medianLastSale)}</p>
        </div>
        <div>
          <p className="label">Average buy now</p>
          <p>{formatCurrency(comp.breakdown.averageBuyNow)}</p>
        </div>
        <div>
          <p className="label">Average highest bid</p>
          <p>{formatCurrency(comp.breakdown.averageHighestBid)}</p>
        </div>
      </div>

      <p className="micro-copy">
        Sample size: {comp.breakdown.sampleSize} marketplaces. Data last updated:{" "}
        {new Date(lastUpdated).toLocaleTimeString()}
      </p>
    </section>
  );
}
