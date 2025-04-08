import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod';
import { createSchema } from 'zod-openapi';
import { UUID_schema } from '../dto/company';

export const createOpenApiSchema = (schema: z.ZodType) => {
  return createSchema(schema).schema as SchemaObject;
};

export const ZodApi = ({
  bodySchema,
  outputSchema,
  status,
}: {
  bodySchema?: z.ZodType;
  status: HttpStatus;
  outputSchema: z.ZodType;
}) => {
  if (bodySchema) {
    return applyDecorators(
      ApiResponse({
        status,
        schema: createOpenApiSchema(outputSchema),
      }),
      ApiBody({
        schema: createOpenApiSchema(bodySchema),
      }),
    );
  }

  return ApiResponse({
    status,
    schema: createOpenApiSchema(outputSchema),
  });
};

export const message_schema = z.object({
  message: z.string(),
});

export const validation_error_schema = z.object({
  message: z.array(z.string()),
  error: z.literal('Bad Request'),
  statusCode: z.literal(400),
});

export const not_found_error_schema = z.object({
  message: z.string(),
  statusCode: z.literal(404),
});

export const category_oa = z.object({
  id: UUID_schema,
  name: z.string(),
});

export const subcategory_oa = z.object({
  id: UUID_schema,
  name: z.string(),
});

export const product_oa = z.object({
  id: UUID_schema,
  name: z.string(),
  price: z.number(),
  barcode: z.string(),
  category: category_oa,
  subcategory: subcategory_oa.nullable(),
});

export const company_oa = z.object({
  id: UUID_schema,
  name: z.string(),
  product: product_oa.nullable(),
});
