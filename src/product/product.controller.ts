import { Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Validate } from '@/common/decorator/validate.decorator';
import {
  create_product_schema,
  product_barcode_schema,
  update_product_schema,
  type CreateProductDto,
  type UpdateProductDto,
} from '@/common/dto/product';
import { UUID_schema } from '@/common/dto/company';
import {
  message_schema,
  not_found_error_schema,
  product_oa,
  validation_error_schema,
  ZodApi,
} from '@/common/util/openapi';
import { ApiOperation } from '@nestjs/swagger';
import { z } from 'zod';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ description: 'Create a new product' })
  @ZodApi({
    bodySchema: create_product_schema,
    outputSchema: message_schema,
    status: HttpStatus.CREATED,
  })
  @ZodApi({
    outputSchema: validation_error_schema,
    status: HttpStatus.BAD_REQUEST,
  })
  @Post()
  createProduct(@Validate('Body', create_product_schema) body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @ApiOperation({ description: 'Get all products' })
  @ZodApi({
    outputSchema: z.array(product_oa),
    status: HttpStatus.OK,
  })
  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiOperation({ description: 'Get a product by id' })
  @ZodApi({
    outputSchema: product_oa,
    status: HttpStatus.OK,
  })
  @ZodApi({
    outputSchema: validation_error_schema,
    status: HttpStatus.BAD_REQUEST,
  })
  @ZodApi({
    outputSchema: not_found_error_schema,
    status: HttpStatus.NOT_FOUND,
  })
  @Get(':id')
  getProductById(@Validate('Param', UUID_schema, 'id') id: string) {
    return this.productService.getProductById(id);
  }

  @ApiOperation({ description: 'Update a product' })
  @ZodApi({
    bodySchema: update_product_schema,
    outputSchema: message_schema,
    status: HttpStatus.OK,
  })
  @ZodApi({
    outputSchema: validation_error_schema,
    status: HttpStatus.BAD_REQUEST,
  })
  @ZodApi({
    outputSchema: not_found_error_schema,
    status: HttpStatus.NOT_FOUND,
  })
  @Patch(':id')
  updateProduct(
    @Validate('Param', UUID_schema, 'id') id: string,
    @Validate('Body', update_product_schema) body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, body);
  }

  @ApiOperation({ description: 'Delete a product' })
  @ZodApi({
    bodySchema: create_product_schema,
    outputSchema: message_schema,
    status: HttpStatus.CREATED,
  })
  @ZodApi({
    outputSchema: validation_error_schema,
    status: HttpStatus.BAD_REQUEST,
  })
  @ZodApi({
    outputSchema: not_found_error_schema,
    status: HttpStatus.NOT_FOUND,
  })
  @Delete(':id')
  deleteProduct(@Validate('Param', UUID_schema, 'id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @ApiOperation({ description: 'Get a product by barcode' })
  @ZodApi({
    outputSchema: product_oa,
    status: HttpStatus.OK,
  })
  @ZodApi({
    outputSchema: validation_error_schema,
    status: HttpStatus.BAD_REQUEST,
  })
  @ZodApi({
    outputSchema: not_found_error_schema,
    status: HttpStatus.NOT_FOUND,
  })
  @Get('barcode/:barcode')
  getProductByBarcode(@Validate('Param', product_barcode_schema, 'barcode') barcode: string) {
    return this.productService.getProductByBarcode(barcode);
  }
}
