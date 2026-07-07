import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import AppError from "../utils/appError.js";

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        const parsed = schemas.params.parse(req.params) as Request["params"];
        Object.keys(req.params).forEach((k) => delete req.params[k]);
        Object.assign(req.params, parsed);
      }

      if (schemas.query) {
        const parsed = schemas.query.parse(req.query) as Request["query"];
        Object.keys(req.query).forEach(
          (k) => delete (req.query as Record<string, unknown>)[k],
        );
        Object.assign(req.query, parsed);
      }

      next();
    } catch (err) {
      if (
        err instanceof ZodError ||
        (err instanceof Error && err.name === "ZodError")
      ) {
        next(err);
      } else {
        next(AppError.internal());
      }
    }
  };
};

export default validate;
