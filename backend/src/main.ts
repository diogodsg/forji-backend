import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { BigIntSerializationInterceptor } from "./common/interceptors/bigint-serialization.interceptor";
import { RequestContextMiddleware } from "./common/middleware/request-context.middleware";
import { httpLogger, logger } from "./common/logger/pino";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });
  app.use(httpLogger);
  app.use(new RequestContextMiddleware().use);
  app.enableCors({
    origin: "*",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.useGlobalInterceptors(new BigIntSerializationInterceptor());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.info({ port }, "API listening");
}
bootstrap();
