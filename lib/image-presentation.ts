const ZOOM_OUT_SKUS = new Set(["384664-060", "AQ3816-056", "DH6927-017"]);

export function shouldZoomOutShoeImage(sku: string): boolean {
  return ZOOM_OUT_SKUS.has(sku);
}
