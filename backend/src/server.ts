import "dotenv/config";
import cron from "node-cron";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { runReminderScan } from "./modules/notification/notification.reminders.js";

// Server bootstrap
app.listen(env.PORT, () => {
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
