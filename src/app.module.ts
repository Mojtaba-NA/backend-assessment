import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './common/entity/category.entity';
import { Company } from './common/entity/company.entity';
import { Product } from './common/entity/product.entity';
import { Subcategory } from './common/entity/subcategory.entity';
import type { EnvironmentVariables } from './common/module/env/env';
import { EnvModule } from './common/module/env/env.module';
import { CompanyModule } from './company/company.module';
import { ProductModule } from './product/product.module';
import { LoggerModule } from './common/module/logger/logger.module';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => {
        console.log(config.get('DATABASE_USER'));
        return {
          type: 'mysql',
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          synchronize: true,
          entities: [Company, Product, Category, Subcategory],
          retryAttempts: 3,
        };
      },
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        store: createKeyv(config.get('REDIS_URL')),
        ttl: 5 * 60 * 1000, // 5 minutes
      }),
      isGlobal: true,
    }),
    LoggerModule,
    CompanyModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
