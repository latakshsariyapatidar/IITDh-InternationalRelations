-- CreateEnum
CREATE TYPE "OutboundProgramType" AS ENUM ('SEMESTER_EXCHANGE', 'RESEARCH_INTERNSHIP', 'SUMMER_PROGRAM', 'DUAL_DEGREE', 'OTHER');

-- CreateEnum
CREATE TYPE "OutboundApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'NOMINATED', 'ACCEPTED_BY_PARTNER', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "outbound_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "partnerId" UUID NOT NULL,
    "rollNumber" VARCHAR(50) NOT NULL,
    "branch" VARCHAR(200) NOT NULL,
    "currentYear" VARCHAR(50) NOT NULL,
    "cgpa" VARCHAR(20) NOT NULL,
    "programType" "OutboundProgramType" NOT NULL,
    "intendedSemester" VARCHAR(50) NOT NULL,
    "motivation" TEXT NOT NULL,
    "statementOfPurposePath" VARCHAR(500),
    "transcriptPath" VARCHAR(500),
    "recommendationLetterPath" VARCHAR(500),
    "status" "OutboundApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewNotes" TEXT,
    "reviewedByAdminId" UUID,
    "submittedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "outbound_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outbound_applications_status_idx" ON "outbound_applications"("status");

-- CreateIndex
CREATE INDEX "outbound_applications_studentId_idx" ON "outbound_applications"("studentId");

-- AddForeignKey
ALTER TABLE "outbound_applications" ADD CONSTRAINT "outbound_applications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_applications" ADD CONSTRAINT "outbound_applications_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_applications" ADD CONSTRAINT "outbound_applications_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
