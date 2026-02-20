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
              title="Average of recent marketplace sales with outlier trimming, then size and condition adjustments."
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
        Average of recent marketplace sales with outlier trimming and size/condition normalization.
      </p>

      <div className="summary-grid">
        <div>
          <p className="label">Trimmed mean</p>
          <p>{formatCurrency(comp.breakdown.trimmedMean)}</p>
        </div>
        <div>
          <p className="label">Median</p>
          <p>{formatCurrency(comp.breakdown.median)}</p>
        </div>
        <div>
          <p className="label">Weighted mean</p>
          <p>{formatCurrency(comp.breakdown.weightedMean)}</p>
        </div>
        <div>
          <p className="label">Sample size</p>
          <p>{comp.breakdown.sampleSize}</p>
        </div>
      </div>

      <div className="weights-row">
        {comp.breakdown.platformWeights.map((weight) => (
          <span key={weight.platform} className="weight-pill">
            {weight.platform}: {(weight.weight * 100).toFixed(0)}%
          </span>
        ))}
      </div>

      <p className="micro-copy">Data last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
    </section>
  );
}
