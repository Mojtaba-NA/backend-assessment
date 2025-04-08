import { Company } from '@/common/entity/company.entity';
import { Product } from '@/common/entity/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import type { CreateUpdateCompanyDto } from 'src/common/dto/company';
import type { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companiesRepository: Repository<Company>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async #deleteCompanyFromCache(id?: string) {
    if (id) {
      await this.cacheManager.del('/company/' + id);
    }
    await this.cacheManager.del('/company');
  }

  async createCompany(body: CreateUpdateCompanyDto) {
    await this.companiesRepository.save(body);
    await this.#deleteCompanyFromCache();
    return { message: 'Company created' };
  }

  getAllCompanies() {
    return this.companiesRepository.find({
      relations: { product: { category: true, subcategory: true } },
    });
  }

  async getCompanyById(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: { product: { category: true, subcategory: true } },
    });

    if (!company) {
      throw new NotFoundException();
    }

    return company;
  }

  async updateCompany(id: string, body: CreateUpdateCompanyDto) {
    const company = await this.companiesRepository.update(id, body);

    if (!company.affected) {
      throw new NotFoundException();
    }
    await this.#deleteCompanyFromCache(id);
    return { message: 'Company updated' };
  }

  async deleteCompany(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!company) {
      throw new NotFoundException();
    }

    await this.companiesRepository.delete(id);

    if (company.product?.id) {
      await this.productsRepository.delete(company.product.id);
    }
    await this.#deleteCompanyFromCache(id);
    return { message: 'Company deleted' };
  }
}
