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
        // Express 5 defines `req.query` as a getter that re-parses `req.url`
        // on every access, so mutating the object it returns (Object.assign)
        // is silently discarded the next time anything reads `req.query`.
        // Redefining the property replaces the getter with the parsed,
        // defaulted value for the rest of this request.
        Object.defineProperty(req, "query", {
          value: parsed,
          writable: true,
          configurable: true,
          enumerable: true,
        });
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
