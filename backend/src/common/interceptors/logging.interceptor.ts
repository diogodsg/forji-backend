import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { logger } from "../logger/pino";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const requestId = req.requestId;
    return next.handle().pipe(
      tap({
        error: (err) => {
          const res = context.switchToHttp().getResponse();
          logger.error(
            {
              msg: "http.error",
              method,
              url,
              status: res.statusCode,
              durationMs: Date.now() - now,
              requestId,
              errorName: err?.name,
              errorMessage: err?.message,
            },
            "HTTP %s %s ERROR %s",
            method,
            url,
            err?.message
          );
        },
      })
    );
  }
}
