import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/exception-filter/typeorm.exception';
import { LoggerService } from './common/module/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));
  app.useGlobalFilters(new TypeOrmExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('TUG Assessment')
    .setDescription('A simple API for TUG assessment')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.use(
    '/reference',
    apiReference({
      content: documentFactory,
      theme: 'purple',
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
