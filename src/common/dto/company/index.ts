import { z } from 'zod';

export const create_update_company_schema = z.object({
  name: z.string().trim().min(3).max(50),
});

export type CreateUpdateCompanyDto = z.infer<typeof create_update_company_schema>;

export const UUID_schema = z.string().uuid();
