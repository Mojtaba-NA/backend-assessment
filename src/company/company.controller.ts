import {
  company_oa,
  message_schema,
  not_found_error_schema,
  validation_error_schema,
  ZodApi,
} from '@/common/util/openapi';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Delete, Get, HttpStatus, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Validate } from 'src/common/decorator/validate.decorator';
import {
  create_update_company_schema,
  UUID_schema,
  type CreateUpdateCompanyDto,
} from 'src/common/dto/company';
import { z } from 'zod';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ description: 'Create a new company' })
  @ZodApi({
    bodySchema: create_update_company_schema,
    outputSchema: message_schema,
    status: HttpStatus.CREATED,
  })
  @ZodApi({
    outputSchema: validation_error_schema,
    status: HttpStatus.BAD_REQUEST,
  })
  @Post()
  createCompany(@Validate('Body', create_update_company_schema) body: CreateUpdateCompanyDto) {
    return this.companyService.createCompany(body);
  }

  @ApiOperation({ description: 'Get all companies' })
  @ZodApi({
    outputSchema: z.array(company_oa),
    status: HttpStatus.OK,
  })
  @UseInterceptors(CacheInterceptor)
  @Get()
  allCompanies() {
    return this.companyService.getAllCompanies();
  }

  @ApiOperation({ description: 'Get a company by id' })
  @ZodApi({
    outputSchema: company_oa,
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
  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  getCompanyById(@Validate('Param', UUID_schema, 'id') id: string) {
    return this.companyService.getCompanyById(id);
  }

  @ApiOperation({ description: 'Update a company' })
  @ZodApi({
    bodySchema: create_update_company_schema,
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
  updateCompany(
    @Validate('Param', UUID_schema, 'id') id: string,
    @Validate('Body', create_update_company_schema) body: CreateUpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(id, body);
  }

  @ApiOperation({ description: 'Delete a company' })
  @ZodApi({
    bodySchema: create_update_company_schema,
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
  @Delete(':id')
  deleteCompany(@Validate('Param', UUID_schema, 'id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
