import type { CreateProductDto, UpdateProductDto } from '@/common/dto/product';
import { Category } from '@/common/entity/category.entity';
import { Company } from '@/common/entity/company.entity';
import { Product } from '@/common/entity/product.entity';
import { Subcategory } from '@/common/entity/subcategory.entity';
import { generate_product_barcode } from '@/common/util/barcode';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Company) private companiesRepository: Repository<Company>,
    @InjectRepository(Category) private categoriesRepository: Repository<Category>,
    @InjectRepository(Subcategory) private subcategorisRepository: Repository<Subcategory>,
  ) {}

  async createProduct(body: CreateProductDto) {
    const company = await this.companiesRepository.findOne({
      where: { id: body.company_id },
      relations: { product: true },
    });

    if (!company) {
      throw new NotFoundException();
    }

    if (company.product?.id) {
      throw new BadRequestException('Company already has a product');
    }

    const [category, subcategory] = await Promise.all([
      this.categoriesRepository.findOne({
        where: { id: body.category_id },
      }),
      body.subcategory_id
        ? this.subcategorisRepository.findOne({
            where: { id: body.subcategory_id },
          })
        : undefined,
    ]);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (subcategory === null) {
      throw new NotFoundException('Subcategory not found');
    }

    await this.productsRepository.save({
      ...body,
      barcode: generate_product_barcode(),
      company,
      category,
      subcategory,
    });

    return { message: 'Product created' };
  }

  getAllProducts() {
    return this.productsRepository.find({
      relations: { company: true, category: true, subcategory: true },
    });
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { company: true, category: true, subcategory: true },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async updateProduct(id: string, body: UpdateProductDto) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    let category: Category | undefined = undefined;
    let subcategory: Subcategory | undefined = undefined;

    if (body.category_id) {
      const cat = await this.categoriesRepository.findOne({
        where: { id: body.category_id },
      });

      if (!cat) {
        throw new NotFoundException("Category doesn't exist");
      }

      category = cat;
    }

    if (body.subcategory_id) {
      const subcat = await this.subcategorisRepository.findOne({
        where: { id: body.subcategory_id },
      });

      if (!subcat) {
        throw new NotFoundException("Subcategory doesn't exist");
      }

      subcategory = subcat;
    }

    const product = await this.productsRepository.update(id, {
      name: body.name,
      price: body.price,
      category,
      subcategory,
    });

    if (!product.affected) {
      throw new NotFoundException();
    }

    return { message: 'Product updated' };
  }

  async deleteProduct(id: string) {
    const product = await this.productsRepository.delete(id);

    if (!product.affected) {
      throw new NotFoundException();
    }

    return { message: 'Product deleted' };
  }

  async getProductByBarcode(barcode: string) {
    const product = await this.productsRepository.findOne({
      where: { barcode },
      relations: { company: true, category: true, subcategory: true },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }
}
