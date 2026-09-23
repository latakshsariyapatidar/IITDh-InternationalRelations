import { deleteSpentRefreshTokens } from "../../modules/auth/auth.repository.js";
import { deleteSpentStudentRefreshTokens } from "../../modules/student-auth/student-auth.repository.js";

// Nothing ever deleted a refresh token. Rows were written on every sign-in and
// every rotation — roughly one per 15 minutes per signed-in tab — and removed
// only on an explicit logout, so both tables grew without limit and carried
// credentials that had stopped working weeks earlier.
//
// Rotation now leaves a revoked row behind on purpose, because that row is
// what makes a replay detectable. It stops being useful once no honest client
// could still be holding the token, so revoked rows are kept for a day and
// then dropped.

const REVOKED_RETENTION_MS = 24 * 60 * 60 * 1000;

export async function purgeSpentSessions(now: Date = new Date()): Promise<number> {
  const revokedBefore = new Date(now.getTime() - REVOKED_RETENTION_MS);

  const [admin, campus] = await Promise.all([
    deleteSpentRefreshTokens(revokedBefore),
    deleteSpentStudentRefreshTokens(revokedBefore),
  ]);

  const total = admin + campus;

  if (total > 0) {
    console.log(
      `[SESSIONS] Purged ${total} expired or spent refresh tokens ` +
        `(${admin} admin, ${campus} campus).`,
    );
  }

  return total;
}
