import "dotenv/config";
import cron from "node-cron";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { runReminderScan } from "./modules/notification/notification.reminders.js";
import { purgeSpentSessions } from "./shared/utils/sessionCleanup.js";

// Server bootstrap
const server = app.listen(env.PORT, () => {
  console.log(`[SERVER] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Daily sweep for expiring visas, passports, exit dates and MOUs. Reminders are
// stored as notifications for the admin panel and emailed to the IRO office as
// one digest. Admins can also trigger it on demand via
// POST /api/v1/notifications/scan.
if (env.NODE_ENV !== "test") {
  if (cron.validate(env.REMINDER_CRON)) {
    cron.schedule(
      env.REMINDER_CRON,
      () => {
        runReminderScan().catch((err) => {
          console.error("[NOTIFICATIONS] Scheduled reminder scan failed:", err);
        });
      },
      { timezone: "Asia/Kolkata" },
    );
    console.log(`[SERVER] Reminder scan scheduled: "${env.REMINDER_CRON}" (Asia/Kolkata)`);
  } else {
    console.error(
      `[SERVER] REMINDER_CRON is not a valid cron expression: "${env.REMINDER_CRON}" — ` +
        "expiry reminders will not run on a schedule.",
    );
  }
}

// Nightly cleanup of refresh tokens that can no longer authenticate anyone.
// Runs on its own schedule rather than inside the reminder scan so a failure
// in one never suppresses the other.
if (env.NODE_ENV !== "test") {
  cron.schedule(
    "30 3 * * *",
    () => {
      purgeSpentSessions().catch((err: unknown) => {
        console.error("[SESSIONS] Scheduled session purge failed:", err);
      });
    },
    { timezone: "Asia/Kolkata" },
  );
}

// // ------- Graceful shutdown ------------------------
//
// Without this, every deploy killed the process outright: in-flight requests
// were dropped mid-response, a running expiry scan stopped halfway, and open
// Postgres connections were left for the server to time out. SIGTERM is what
// a container runtime sends first, so it is the signal that decides whether a
// restart is invisible to whoever was using the site.

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`[SERVER] ${signal} received — finishing in-flight requests.`);

  // Stops accepting new connections; the callback fires once the open ones
  // have finished.
  server.close(() => {
    void prisma
      .$disconnect()
      .catch((err: unknown) => console.error("[SERVER] Prisma disconnect failed:", err))
      .finally(() => {
        console.log("[SERVER] Shutdown complete.");
        process.exit(0);
      });
  });

  // A request that never finishes must not hold the deploy open forever.
  setTimeout(() => {
    console.error("[SERVER] Shutdown timed out after 15s — exiting anyway.");
    process.exit(1);
  }, 15_000).unref();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
