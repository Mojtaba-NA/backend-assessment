import { Body, Param, Query } from '@nestjs/common';
import type { z } from 'zod';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';

const options = {
  Query: Query,
  Body: Body,
  Param: Param,
} as const;

export const Validate = (type: keyof typeof options, schema: z.ZodTypeAny, property?: string) => {
  if (property === undefined) {
    return options[type](new ZodValidationPipe(schema));
  }

  return options[type](property, new ZodValidationPipe(schema));
};
