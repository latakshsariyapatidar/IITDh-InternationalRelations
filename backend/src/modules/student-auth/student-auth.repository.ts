import { prisma } from "../../config/prisma.js";

export async function upsertStudent(data: { email: string; name: string; googleSub: string }) {
  return prisma.student.upsert({
    where: { googleSub: data.googleSub },
    update: { email: data.email, name: data.name },
    create: data,
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
