import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="product-not-found">
      <div className="panel-card product-not-found-card">
        <h1>Product not found</h1>
        <p className="muted-copy">This product is not in the mock catalog.</p>
        <Link href="/" className="primary-button">
          Back to search
        </Link>
      </div>
    </section>
  );
}
