export interface ItemCache {
  variantQuantity?: number; // Current stock of the product variant, undefined if the product variant was removed
  inputQuantity?: number | null; // User-entered quantity, undefined before interaction
}
