import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Special handling for OAuth callback errors - redirect instead of JSON
    if (request.url.includes('/auth/google/callback')) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      let errorMessage = 'Authentication failed';

      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        if (typeof exceptionResponse === 'string') {
          errorMessage = exceptionResponse;
        } else if (typeof exceptionResponse === 'object') {
          errorMessage = (exceptionResponse as any).message || errorMessage;
        }
      } else if (exception instanceof Error) {
        errorMessage = exception.message;
      }

      const redirectUrl = `${frontendUrl}/auth/callback?error=${encodeURIComponent(errorMessage)}`;
      this.logger.error(
        `OAuth Error: ${errorMessage}`,
        exception instanceof Error ? exception.stack : '',
      );
      return response.redirect(redirectUrl);
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    }
    // Handle Prisma errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';

      switch (exception.code) {
        case 'P2002':
          message = `Duplicate value for ${exception.meta?.target || 'field'}`;
          status = HttpStatus.CONFLICT;
          break;
        case 'P2025':
          message = 'Record not found';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          message = 'Foreign key constraint failed';
          break;
        case 'P2014':
          message = 'Invalid ID';
          break;
        default:
          message = 'Database operation failed';
      }

      this.logger.error(`Prisma Error ${exception.code}: ${exception.message}`, exception.stack);
    }
    // Handle validation errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Validation Error';
      message = 'Invalid data provided';
      this.logger.error(`Validation Error: ${exception.message}`, exception.stack);
    }
    // Handle unknown errors
    else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
      message = process.env.NODE_ENV === 'production' ? 'Internal server error' : exception.message;
    }

    // Log all errors in development
    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(
          {
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
          null,
          2,
        ),
      );
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
