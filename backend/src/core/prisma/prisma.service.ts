import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { logger } from "../../common/logger/pino";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const t0 = Date.now();
    // Super sem config personalizada; poderia receber log-level ou datasources.
    super();
    // eslint-disable-next-line no-console
    console.log(`[PRISMA] PrismaService constructed in ${Date.now() - t0}ms`);
  }
  async onModuleInit() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      logger.warn(
        {
          msg: "prisma.missing_database_url",
        },
        "DATABASE_URL não definida – verifique seu .env"
      );
    }
    const started = Date.now();
    logger.info({ msg: "prisma.connect.start" }, "Conectando ao banco...");
    try {
      await this.$connect();
      logger.info(
        { msg: "prisma.connect.success", ms: Date.now() - started },
        "Conectado ao banco (%d ms)",
        Date.now() - started
      );
    } catch (err: any) {
      logger.error(
        {
          msg: "prisma.connect.error",
          errorName: err?.name,
          errorMessage: err?.message,
        },
        "Falha ao conectar ao banco: %s",
        err?.message
      );
      throw err;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on("beforeExit", async () => {
      await app.close();
    });
  }
}
