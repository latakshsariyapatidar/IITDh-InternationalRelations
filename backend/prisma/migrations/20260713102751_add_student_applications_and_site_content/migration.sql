-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "EnglishTestType" AS ENUM ('IELTS', 'TOEFL', 'PTE', 'DUOLINGO', 'NATIVE_SPEAKER', 'OTHER', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUESTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "SiteContentType" AS ENUM ('TEXT', 'RICH_TEXT', 'IMAGE', 'NUMBER');

-- CreateTable
CREATE TABLE "student_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dateOfBirth" TIMESTAMPTZ(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" VARCHAR(100) NOT NULL,
    "countryOfResidence" VARCHAR(100) NOT NULL,
    "passportNumber" VARCHAR(50) NOT NULL,
    "passportExpiryDate" TIMESTAMPTZ(3) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "emergencyContactName" VARCHAR(200) NOT NULL,
    "emergencyContactPhone" VARCHAR(50) NOT NULL,
    "emergencyContactRelation" VARCHAR(100),
    "programLevel" "ProgramLevel" NOT NULL,
    "programAppliedFor" VARCHAR(200) NOT NULL,
    "intendedIntake" VARCHAR(50) NOT NULL,
    "highestQualification" VARCHAR(200) NOT NULL,
    "previousInstitution" VARCHAR(300) NOT NULL,
    "previousGradeOrGPA" VARCHAR(100) NOT NULL,
    "englishTestType" "EnglishTestType" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "englishTestScore" VARCHAR(50),
    "visaCategory" VARCHAR(100),
    "requiresVisaSponsorship" BOOLEAN NOT NULL DEFAULT true,
    "passportCopyPath" VARCHAR(500),
    "photoPath" VARCHAR(500),
    "academicTranscriptsPath" VARCHAR(500),
    "englishTestScoreCardPath" VARCHAR(500),
    "statementOfPurposePath" VARCHAR(500),
    "financialProofPath" VARCHAR(500),
    "recommendationLetterPath" VARCHAR(500),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewNotes" TEXT,
    "reviewedByAdminId" UUID,
    "submittedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "student_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_content" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(150) NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "page" VARCHAR(100) NOT NULL,
    "type" "SiteContentType" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_applications_status_idx" ON "student_applications"("status");

-- CreateIndex
CREATE INDEX "student_applications_nationality_idx" ON "student_applications"("nationality");

-- CreateIndex
CREATE UNIQUE INDEX "site_content_key_key" ON "site_content"("key");

-- CreateIndex
CREATE INDEX "site_content_page_idx" ON "site_content"("page");

-- AddForeignKey
ALTER TABLE "student_applications" ADD CONSTRAINT "student_applications_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
