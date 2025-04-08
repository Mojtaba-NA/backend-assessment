import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { z } from 'zod';

export const formatErrors = (error: z.ZodError) =>
  error.errors.map((err) =>
    err.path.length ? `${err.path.join('.')}: ${err.message}` : err.message,
  );

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodTypeAny) {}

  async transform(value: any): Promise<any> {
    const res = await this.schema.safeParseAsync(value);

    if (!res.success) {
      const error = formatErrors(res.error);
      const message = error[0] === 'Required' ? 'Empty body' : error;

      throw new BadRequestException(message);
    }

    return res.data;
  }
}
