import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Ensure BigInt fields returned from Prisma serialize as strings in JSON responses
  if (!(BigInt.prototype as any).toJSON) {
    // eslint-disable-next-line no-extend-native
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "*",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
