import pino, { Logger } from "pino";
import pinoHttp from "pino-http";

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : { target: "pino-pretty", options: { colorize: true } },
});

// Wrap in any to bypass strict variance mismatch with pino-http generic expectations.
export const httpLogger = pinoHttp({
  logger: logger as any,
  customProps: (req) => ({ requestId: (req as any).requestId }),
  serializers: {
    req(req) {
      return { id: (req as any).id, method: req.method, url: req.url };
    },
  },
});
