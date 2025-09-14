import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { BigIntSerializationInterceptor } from "./common/interceptors/bigint-serialization.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { RequestContextMiddleware } from "./common/middleware/request-context.middleware";
import { httpLogger, logger } from "./common/logger/pino";

async function bootstrap() {
  const t0 = Date.now();
  console.log("[BOOT] Creating Nest application instance...");
  let created = false;
  const watchdog = setTimeout(() => {
    if (!created) {
      // eslint-disable-next-line no-console
      console.error(
        "[BOOT][WATCHDOG] App creation still pending after 5000ms (possível deadlock em provider)."
      );
    }
  }, 5000);
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: false,
    });
    created = true;
    clearTimeout(watchdog);
    console.log(`[BOOT] App created in ${Date.now() - t0}ms`);
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
    console.log("[BOOT] Global pipes set");
    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new BigIntSerializationInterceptor()
    );
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.info({ port }, "API listening");
  } catch (err: any) {
    clearTimeout(watchdog);
    // eslint-disable-next-line no-console
    console.error("[BOOT] Erro ao criar aplicação:", err);
    process.exit(1);
  }
}
bootstrap();
