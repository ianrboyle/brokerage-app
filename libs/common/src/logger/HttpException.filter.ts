import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CustomLogDto } from './dtos/custom-log-dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  //
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionMessage = exception['response']?.message
      ? exception['response']?.message
      : null;
    const message =
      exception instanceof HttpException
        ? exception?.message + ': ' + exceptionMessage
        : 'Internal server error';
    const log: CustomLogDto = {
      statusCode: statusCode || 500,
      path: request?.url,
      timestamp: new Date(),
      message: message,
      stack: exception?.stack,
      exceptionName: exception?.name,
    };

    console.log(JSON.stringify(exception));
    this.loggerService.log(log);
    response.status(statusCode).json({
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
