/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';
import { formatErrors } from '../../pipe/zod-validation.pipe';

const EnvironmentVariablesSchema = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().int(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_NAME: z.string(),
  REDIS_URL: z.string(),
});

export function validateEnv(config: Record<string, unknown>) {
  const result = EnvironmentVariablesSchema.safeParse(config);

  if (!result.success) {
    throw new Error(formatErrors(result.error).join('\n'));
  }

  return result.data;
}

type EnvSchema = typeof EnvironmentVariablesSchema;

export type EnvironmentVariables = z.infer<EnvSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}
