import type { Request, Response, NextFunction } from "express";

const cacheControl = (seconds: number) => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.set(
      "Cache-Control",
      `public, max-age=${seconds}, stale-while-revalidate=${seconds * 5}`,
    );
    next();
  };
};

export default cacheControl;
