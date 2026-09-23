import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * `options: "-c timezone=UTC"` pins the Postgres *session* timezone for every
 * connection in the pool, and it is load-bearing.
 *
 * Prisma's pg driver adapter sends a DateTime as a timestamp string with no
 * offset on it. Postgres then resolves that string using whatever the session
 * timezone happens to be — which, unset, is inherited from the machine. On a
 * developer's laptop in Asia/Kolkata that meant an instant of 05:06 UTC was
 * stored as 05:06 IST, i.e. 23:36 UTC the previous day: every timestamp in the
 * database was 5 hours 30 minutes away from the instant it was meant to record.
 *
 * It was invisible from inside the application, because reads applied the same
 * offset in reverse and everything compared consistently. It was not invisible
 * anywhere else: a SQL report, a backup, a BI tool or pgAdmin all showed the
 * wrong time, and any query mixing an application-written column with Postgres'
 * own now() compared two different clocks.
 *
 * The part that would have bitten hardest is deployment. Containers run UTC by
 * default, so the same code in Docker writes correct values while every row
 * written from a laptop reads back 5.5 hours out — the offset moves with the
 * host. Pinning the session removes the host from the question entirely.
 */
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  options: "-c timezone=UTC",
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // "query" logs the SQL *and its parameter values*, which on this API
    // includes passport numbers, dates of birth and contact details. It stays
    // off outside development.
    log:
      env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
