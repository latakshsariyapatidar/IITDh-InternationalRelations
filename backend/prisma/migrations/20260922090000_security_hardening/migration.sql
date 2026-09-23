-- Security hardening: refresh-token families and reuse detection, per-account
-- login throttling, a PII document access log, and MOU deletion no longer
-- cascading behind the application's back.

-- CreateEnum
CREATE TYPE "DocumentAccessMethod" AS ENUM ('SESSION', 'SIGNED_LINK');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoginAt" TIMESTAMPTZ(3),
ADD COLUMN     "lockedUntil" TIMESTAMPTZ(3);

-- AlterTable
-- gen_random_uuid() is volatile, so Postgres evaluates it per row: every
-- existing session becomes its own family rather than all sharing one.
ALTER TABLE "refresh_tokens" ADD COLUMN     "familyId" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "revokedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "student_refresh_tokens" ADD COLUMN     "familyId" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "revokedAt" TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "document_access_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scope" VARCHAR(64) NOT NULL,
    "recordId" UUID NOT NULL,
    "field" VARCHAR(64) NOT NULL,
    "method" "DocumentAccessMethod" NOT NULL,
    "actorEmail" VARCHAR(255),
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(400),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_access_logs_recordId_idx" ON "document_access_logs"("recordId");

-- CreateIndex
CREATE INDEX "document_access_logs_createdAt_idx" ON "document_access_logs"("createdAt");

-- CreateIndex
CREATE INDEX "document_access_logs_scope_recordId_idx" ON "document_access_logs"("scope", "recordId");

-- CreateIndex
CREATE INDEX "refresh_tokens_adminId_idx" ON "refresh_tokens"("adminId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");

-- CreateIndex
CREATE INDEX "student_refresh_tokens_studentId_idx" ON "student_refresh_tokens"("studentId");

-- CreateIndex
CREATE INDEX "student_refresh_tokens_expiresAt_idx" ON "student_refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "student_refresh_tokens_familyId_idx" ON "student_refresh_tokens"("familyId");

-- DropForeignKey
ALTER TABLE "mous" DROP CONSTRAINT "mous_partnerId_fkey";

-- AddForeignKey
ALTER TABLE "mous" ADD CONSTRAINT "mous_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
