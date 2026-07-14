import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";

const authorize = () => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        AppError.internal(
          "authorize() called without authenticate() — check route definition",
        ),
      );
    }
    next();
  };
};

export default authorize;
