import type { Request, Response, NextFunction } from "express";

/**
 * Marks a public GET as cacheable.
 *
 * Some of the routes using this sit behind `optionalAuthenticate`, where an
 * admin token widens the response to include drafts and expired rows. Storing
 * that under a shared `public` entry would let a CDN hand an admin's view to
 * the next anonymous visitor, so a request that carries credentials is marked
 * private and uncacheable instead.
 *
 * `Vary: Authorization` states the dependency for caches that key on it.
 */
const cacheControl = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.vary("Authorization");

    if (req.headers.authorization) {
      res.set("Cache-Control", "private, no-store");
    } else {
      res.set(
        "Cache-Control",
        `public, max-age=${seconds}, stale-while-revalidate=${seconds * 5}`,
      );
    }

    next();
  };
};

export default cacheControl;
