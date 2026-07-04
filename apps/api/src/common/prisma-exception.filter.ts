import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";

const PrismaErrorMapping: Record<string, { status: HttpStatus; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: "Value too long for column" },
  P2002: { status: HttpStatus.CONFLICT, message: "Unique constraint violation" },
  P2025: { status: HttpStatus.NOT_FOUND, message: "Record not found" },
  P2003: { status: HttpStatus.BAD_REQUEST, message: "Foreign key constraint failed" },
  P2014: { status: HttpStatus.BAD_REQUEST, message: "Required relation violation" },
  P2016: { status: HttpStatus.BAD_REQUEST, message: "Query interpretation error" },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorCode = exception.code;
    const mapping = PrismaErrorMapping[errorCode];

    if (mapping) {
      this.logger.warn(`[Prisma ${errorCode}] ${exception.message} — ${request.method} ${request.url}`);

      const field =
        errorCode === "P2002"
          ? (exception.meta as any)?.target?.join(", ") || "field"
          : "";

      response.status(mapping.status).json({
        statusCode: mapping.status,
        message: field ? `${mapping.message} on ${field}` : mapping.message,
        errorCode,
      });
    } else {
      this.logger.error(`[Prisma ${errorCode}] ${exception.message} — ${request.method} ${request.url}`);
      super.catch(exception, host);
    }
  }
}
