import { prisma } from "../../config/prisma.js";

export async function upsertStudent(data: { email: string; name: string; googleSub: string }) {
  return prisma.student.upsert({
    where: { googleSub: data.googleSub },
    update: { email: data.email, name: data.name, lastLoginAt: new Date() },
    create: { ...data, lastLoginAt: new Date() },
  });
}

/**
 * The faculty directory doubles as the portal allowlist: a verified
 * @iitdh.ac.in sign-in whose address is listed here signs in as faculty.
 * Everyone else — including every student — signs in as a student.
 */
export async function findPortalFacultyByEmail(email: string) {
  return prisma.faculty.findFirst({
    where: { email, isActive: true, isPortalEnabled: true },
    select: { id: true, name: true },
  });
}

export async function storeStudentRefreshToken(
  studentId: string,
  tokenHash: string,
  expiresAt: Date,
  familyId?: string,
) {
  return prisma.studentRefreshToken.create({
    data: { studentId, tokenHash, expiresAt, ...(familyId && { familyId }) },
  });
}

export async function findStudentRefreshTokenByHash(tokenHash: string) {
  return prisma.studentRefreshToken.findUnique({
    where: { tokenHash },
    include: { student: { select: { id: true, email: true } } },
  });
}

/**
 * Same single-statement claim as the admin side — see the long note on
 * `claimRefreshToken` in modules/auth/auth.repository.ts. Exactly one
 * concurrent caller can observe `count === 1`.
 */
export async function claimStudentRefreshToken(tokenHash: string, now: Date) {
  const { count } = await prisma.studentRefreshToken.updateMany({
    where: { tokenHash, revokedAt: null, expiresAt: { gt: now } },
    data: { revokedAt: now },
  });

  return count === 1;
}

export async function revokeStudentTokenFamily(familyId: string) {
  return prisma.studentRefreshToken.deleteMany({ where: { familyId } });
}

export async function deleteStudentRefreshToken(tokenHash: string) {
  return prisma.studentRefreshToken.deleteMany({ where: { tokenHash } });
}

/** Nightly cleanup of rows that can no longer authenticate anyone. */
export async function deleteSpentStudentRefreshTokens(revokedBefore: Date) {
  const now = new Date();

  const [expired, revoked] = await Promise.all([
    prisma.studentRefreshToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.studentRefreshToken.deleteMany({
      where: { revokedAt: { lt: revokedBefore } },
    }),
  ]);

  return expired.count + revoked.count;
}
