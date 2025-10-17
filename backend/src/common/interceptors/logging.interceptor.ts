import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    // Get user info from JWT if available
    const user = (request as any).user;
    const userId = user?.sub || 'anonymous';

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const contentLength = response.get('content-length') || 0;
          const responseTime = Date.now() - now;

          this.logger.log(
            `${method} ${url} ${statusCode} ${responseTime}ms ${contentLength} bytes - ${userId} - ${ip} - ${userAgent}`,
          );
        },
        error: (error) => {
          const statusCode = error?.status || 500;
          const responseTime = Date.now() - now;

          this.logger.error(
            `${method} ${url} ${statusCode} ${responseTime}ms - ${userId} - ${ip} - ${error?.message || 'Unknown error'}`,
          );
        },
      }),
    );
  }
}
