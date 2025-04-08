import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/common/entity/product.entity';
import { Company } from '@/common/entity/company.entity';
import { Category } from '@/common/entity/category.entity';
import { Subcategory } from '@/common/entity/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Company, Category, Subcategory])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
