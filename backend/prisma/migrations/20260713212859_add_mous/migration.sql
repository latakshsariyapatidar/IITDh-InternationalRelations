-- CreateEnum
CREATE TYPE "MouStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'RENEWED', 'TERMINATED');

-- CreateTable
CREATE TABLE "mous" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "partnerId" UUID NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "signedDate" TIMESTAMPTZ(3) NOT NULL,
    "expiryDate" TIMESTAMPTZ(3),
    "status" "MouStatus" NOT NULL DEFAULT 'ACTIVE',
    "scope" TEXT,
    "documentPath" VARCHAR(500),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "mous_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mous_status_idx" ON "mous"("status");

-- CreateIndex
CREATE INDEX "mous_partnerId_idx" ON "mous"("partnerId");

-- AddForeignKey
ALTER TABLE "mous" ADD CONSTRAINT "mous_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
