import pino, { Logger } from "pino";

// Nota: o transport "pino-pretty" é carregado apenas fora de produção para logs legíveis.
// Certifique-se de que a dependência dev "pino-pretty" esteja instalada. Caso não queira
// instalar (ex. em ambiente minimalista), defina NODE_ENV=production ou LOG_PRETTY=0 para
// desativar o pretty transport e usar JSON puro.
const enablePretty =
  process.env.NODE_ENV !== "production" && process.env.LOG_PRETTY !== "0";

let transport: any = undefined;
if (enablePretty) {
  // Se por algum motivo "pino-pretty" não estiver instalado, evitamos quebrar o boot.
  try {
    transport = { target: "pino-pretty", options: { colorize: true } };
  } catch (e) {
    // Fallback silencioso para JSON estruturado.
    // eslint-disable-next-line no-console
    console.warn("[logger] pino-pretty não disponível, usando output JSON");
  }
}

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport,
});

// Middleware HTTP custom que substitui pino-http evitando crashes em Node 22.
// Mantém a maioria dos campos úteis.
export function httpLogger(req: any, res: any, next: () => void) {
  const start = Date.now();
  const requestId = req.requestId;
  const slowThreshold = parseInt(process.env.HTTP_SLOW_MS || "1000", 10);
  // Child logger com contexto base reutilizável em serviços/handlers
  const baseLog = logger.child({ requestId, method: req.method, url: req.url });
  req.log = baseLog;

  // Ignora OPTIONS (CORS preflight) exceto se quiser debug
  if (req.method !== "OPTIONS") {
    baseLog.info({ msg: "http.start" }, "--> %s %s", req.method, req.url);
  }

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const contentLength = res.getHeader("content-length");
    const userId = req.user?.id;
    const status = res.statusCode;
    const level: "info" | "warn" | "error" =
      status >= 500 ? "error" : durationMs > slowThreshold ? "warn" : "info";
    const payload: any = {
      msg: "http.end",
      status,
      durationMs,
      slow: durationMs > slowThreshold || undefined,
      contentLength,
      userId,
    };
    (baseLog as any)[level](
      payload,
      "<-- %s %s %d (%dms)%s",
      req.method,
      req.url,
      status,
      durationMs,
      durationMs > slowThreshold ? " SLOW" : ""
    );
  });
  next();
}
