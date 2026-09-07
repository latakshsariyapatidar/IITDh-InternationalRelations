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

export async function storeStudentRefreshToken(studentId: string, tokenHash: string, expiresAt: Date) {
  return prisma.studentRefreshToken.create({ data: { studentId, tokenHash, expiresAt } });
}

export async function findStudentRefreshTokenByHash(tokenHash: string) {
  return prisma.studentRefreshToken.findUnique({
    where: { tokenHash },
    include: { student: { select: { id: true, email: true } } },
  });
}

export async function deleteStudentRefreshToken(tokenHash: string) {
  return prisma.studentRefreshToken.delete({ where: { tokenHash } });
}
