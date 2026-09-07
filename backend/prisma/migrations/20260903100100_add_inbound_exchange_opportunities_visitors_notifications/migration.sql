-- CreateEnum
CREATE TYPE "ExchangeType" AS ENUM ('SEMESTER_EXCHANGE', 'RESEARCH_INTERNSHIP', 'SUMMER_PROGRAM', 'OTHER');

-- CreateEnum
CREATE TYPE "OpportunityAudience" AS ENUM ('STUDENT', 'FACULTY', 'BOTH');

-- CreateEnum
CREATE TYPE "OpportunityCategory" AS ENUM ('SCHOLARSHIP', 'EXCHANGE', 'INTERNSHIP', 'RESEARCH', 'FELLOWSHIP', 'CONFERENCE', 'GRANT', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('VISA_EXPIRING', 'PASSPORT_EXPIRING', 'MOU_EXPIRING', 'EXIT_DATE_APPROACHING', 'NEW_INBOUND_APPLICATION', 'NEW_EXCHANGE_APPLICATION', 'NEW_VISITOR', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "visibleUntil" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "faculty" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "isPortalEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "outbound_applications" ADD COLUMN     "statementOfPurposeText" TEXT;

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "championDesignation" VARCHAR(200),
ADD COLUMN     "championEmail" VARCHAR(255),
ADD COLUMN     "championName" VARCHAR(200),
ADD COLUMN     "countryCode" VARCHAR(2);

-- AlterTable
ALTER TABLE "student_applications" ADD COLUMN     "cForm" VARCHAR(100),
ADD COLUMN     "citizenshipNo" VARCHAR(100),
ADD COLUMN     "dateOfJoining" TIMESTAMPTZ(3),
ADD COLUMN     "exitDate" TIMESTAMPTZ(3),
ADD COLUMN     "facultyAdvisor" VARCHAR(200),
ADD COLUMN     "instituteEmail" VARCHAR(255),
ADD COLUMN     "officeRemarks" TEXT,
ADD COLUMN     "passportIssueDate" TIMESTAMPTZ(3),
ADD COLUMN     "passportPlaceOfIssue" VARCHAR(200),
ADD COLUMN     "programLevelOther" VARCHAR(200),
ADD COLUMN     "rollNumber" VARCHAR(50),
ADD COLUMN     "sForm" VARCHAR(100),
ADD COLUMN     "sponsoringAgency" VARCHAR(300),
ADD COLUMN     "visaDetails" VARCHAR(200),
ADD COLUMN     "visaExpiryDate" TIMESTAMPTZ(3),
ADD COLUMN     "visaIssueDate" TIMESTAMPTZ(3),
ADD COLUMN     "visaPlaceOfIssue" VARCHAR(200),
ADD COLUMN     "yearOfJoining" VARCHAR(20);

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "lastLoginAt" TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "inbound_exchange_applications" (
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
    "homeUniversity" VARCHAR(300) NOT NULL,
    "homeUniversityCountry" VARCHAR(100) NOT NULL,
    "homeProgramOfStudy" VARCHAR(200) NOT NULL,
    "exchangeType" "ExchangeType" NOT NULL,
    "exchangeTypeOther" VARCHAR(200),
    "programLevel" "ProgramLevel" NOT NULL,
    "programLevelOther" VARCHAR(200),
    "proposedDepartment" VARCHAR(200),
    "proposedFacultyHost" VARCHAR(200),
    "intendedStayFrom" TIMESTAMPTZ(3) NOT NULL,
    "intendedStayTo" TIMESTAMPTZ(3) NOT NULL,
    "purposeOfVisit" TEXT NOT NULL,
    "visaCategory" VARCHAR(100),
    "requiresVisaSponsorship" BOOLEAN NOT NULL DEFAULT true,
    "passportCopyPath" VARCHAR(500),
    "photoPath" VARCHAR(500),
    "academicTranscriptsPath" VARCHAR(500),
    "nominationLetterPath" VARCHAR(500),
    "statementOfPurposePath" VARCHAR(500),
    "financialProofPath" VARCHAR(500),
    "recommendationLetterPath" VARCHAR(500),
    "rollNumber" VARCHAR(50),
    "instituteEmail" VARCHAR(255),
    "sponsoringAgency" VARCHAR(300),
    "yearOfJoining" VARCHAR(20),
    "dateOfJoining" TIMESTAMPTZ(3),
    "exitDate" TIMESTAMPTZ(3),
    "facultyAdvisor" VARCHAR(200),
    "citizenshipNo" VARCHAR(100),
    "passportIssueDate" TIMESTAMPTZ(3),
    "passportPlaceOfIssue" VARCHAR(200),
    "visaDetails" VARCHAR(200),
    "visaIssueDate" TIMESTAMPTZ(3),
    "visaExpiryDate" TIMESTAMPTZ(3),
    "visaPlaceOfIssue" VARCHAR(200),
    "sForm" VARCHAR(100),
    "cForm" VARCHAR(100),
    "officeRemarks" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewNotes" TEXT,
    "reviewedByAdminId" UUID,
    "submittedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inbound_exchange_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "audience" "OpportunityAudience" NOT NULL,
    "category" "OpportunityCategory" NOT NULL DEFAULT 'OTHER',
    "organisation" VARCHAR(300),
    "country" VARCHAR(100),
    "countryCode" VARCHAR(2),
    "externalUrl" VARCHAR(500),
    "attachmentUrl" VARCHAR(500),
    "applicationDeadline" TIMESTAMPTZ(3),
    "publishedAt" TIMESTAMPTZ(3),
    "visibleUntil" TIMESTAMPTZ(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullName" VARCHAR(200) NOT NULL,
    "designation" VARCHAR(200),
    "organisation" VARCHAR(300) NOT NULL,
    "department" VARCHAR(200),
    "country" VARCHAR(100) NOT NULL,
    "countryCode" VARCHAR(2),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "nationality" VARCHAR(100),
    "passportNumber" VARCHAR(50),
    "purposeOfVisit" TEXT NOT NULL,
    "visitFrom" TIMESTAMPTZ(3) NOT NULL,
    "visitTo" TIMESTAMPTZ(3),
    "hostName" VARCHAR(200),
    "hostDepartment" VARCHAR(200),
    "websiteOrProfileUrl" VARCHAR(500),
    "remarks" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "NotificationType" NOT NULL,
    "severity" "NotificationSeverity" NOT NULL DEFAULT 'INFO',
    "title" VARCHAR(300) NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" VARCHAR(50),
    "entityId" UUID,
    "dueDate" TIMESTAMPTZ(3),
    "dedupeKey" VARCHAR(255) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMPTZ(3),
    "emailedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inbound_exchange_applications_status_idx" ON "inbound_exchange_applications"("status");

-- CreateIndex
CREATE INDEX "inbound_exchange_applications_nationality_idx" ON "inbound_exchange_applications"("nationality");

-- CreateIndex
CREATE INDEX "inbound_exchange_applications_visaExpiryDate_idx" ON "inbound_exchange_applications"("visaExpiryDate");

-- CreateIndex
CREATE INDEX "inbound_exchange_applications_exitDate_idx" ON "inbound_exchange_applications"("exitDate");

-- CreateIndex
CREATE INDEX "opportunities_audience_idx" ON "opportunities"("audience");

-- CreateIndex
CREATE INDEX "opportunities_isActive_idx" ON "opportunities"("isActive");

-- CreateIndex
CREATE INDEX "opportunities_visibleUntil_idx" ON "opportunities"("visibleUntil");

-- CreateIndex
CREATE INDEX "visitors_country_idx" ON "visitors"("country");

-- CreateIndex
CREATE INDEX "visitors_visitFrom_idx" ON "visitors"("visitFrom");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_dedupeKey_key" ON "notifications"("dedupeKey");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_dueDate_idx" ON "notifications"("dueDate");

-- CreateIndex
CREATE INDEX "announcements_visibleUntil_idx" ON "announcements"("visibleUntil");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE INDEX "partners_country_idx" ON "partners"("country");

-- CreateIndex
CREATE INDEX "student_applications_visaExpiryDate_idx" ON "student_applications"("visaExpiryDate");

-- CreateIndex
CREATE INDEX "student_applications_exitDate_idx" ON "student_applications"("exitDate");

-- AddForeignKey
ALTER TABLE "inbound_exchange_applications" ADD CONSTRAINT "inbound_exchange_applications_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
