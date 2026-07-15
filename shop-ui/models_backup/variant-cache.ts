import {FilePreview} from './file-preview';

// price and quantity is undefined initially to allow backend-persisted data to be used instead
export interface VariantCache {
  price?: string; // User-entered price, undefined before interaction
  quantity?: number | null; // User-entered quantity, undefined before interaction
  filePreview: FilePreview | null;
}
