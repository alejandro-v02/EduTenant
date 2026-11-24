import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  // whitelist + forbidNonWhitelisted refuerzan la regla de aislamiento: si un
  // cliente intenta enviar "institucionId" en el body/query de un endpoint
  // cuyo DTO no lo declara, la request se rechaza con 400 antes de llegar al
  // controller.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const puerto = configService.get<number>('puerto') ?? 3000;

  await app.listen(puerto);
}

bootstrap();
