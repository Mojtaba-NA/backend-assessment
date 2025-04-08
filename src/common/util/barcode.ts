import { customAlphabet } from 'nanoid';

export const generate_product_barcode = customAlphabet(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  18,
);
