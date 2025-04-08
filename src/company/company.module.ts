import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/common/entity/company.entity';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Product } from '@/common/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Product])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
