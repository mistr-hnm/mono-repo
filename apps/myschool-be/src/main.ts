import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors("*")
  app.setGlobalPrefix("api")
  app.use(json({ limit: '50mb'}))
  app.use(urlencoded({extended : true, limit : '50mb'}));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
