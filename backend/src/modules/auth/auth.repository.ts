import { prisma } from "../../config/prisma.js";

export async function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });
}

export async function storeRefreshToken(
  adminId: string,
  tokenHash: string,
  expiresAt: Date,
) {
  return prisma.refreshToken.create({
    data: { adminId, tokenHash, expiresAt },
  });
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { admin: { select: { id: true, email: true } } },
  });
}

export async function deleteRefreshToken(tokenHash: string) {
  return prisma.refreshToken.delete({ where: { tokenHash } });
}

export async function deleteAllRefreshTokensForAdmin(adminId: string) {
  return prisma.refreshToken.deleteMany({ where: { adminId } });
}
