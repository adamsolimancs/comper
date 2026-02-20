import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="panel-card">
      <h1>Product not found</h1>
      <p className="muted-copy">This product is not in the mock catalog.</p>
      <Link href="/" className="primary-button">
        Back to search
      </Link>
    </div>
  );
}
