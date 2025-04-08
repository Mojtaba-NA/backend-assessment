import { z } from 'zod';
import { UUID_schema } from '../company';

export const create_product_schema = z.object({
  company_id: UUID_schema,
  category_id: UUID_schema,
  subcategory_id: UUID_schema.optional(),
  name: z.string().trim().min(3).max(50),
  price: z.number().min(0),
});

export type CreateProductDto = z.infer<typeof create_product_schema>;

export const update_product_schema = create_product_schema
  .pick({ name: true, category_id: true, subcategory_id: true, price: true })
  .partial();

export type UpdateProductDto = z.infer<typeof update_product_schema>;

export const product_barcode_schema = z.string().length(18);
