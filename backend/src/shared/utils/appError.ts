export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  details?: ValidationErrorDetail[];

  constructor(
    message: string,
    statusCode: number,
    details?: ValidationErrorDetail[],
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: ValidationErrorDetail[]) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message: string) {
    return new AppError(message, 401);
  }

  static forbidden(message: string) {
    return new AppError(message, 403);
  }

  static notFound(message: string) {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }

  static internal(message: string = "Something went wrong") {
    return new AppError(message, 500);
  }
}
