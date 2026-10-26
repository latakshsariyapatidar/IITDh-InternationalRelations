-- CreateEnum
CREATE TYPE "Discipline" AS ENUM ('ENGINEERING', 'SCIENCE');

-- AlterTable
ALTER TABLE "student_applications" ADD COLUMN     "combinedDocumentsPath" VARCHAR(500),
ADD COLUMN     "discipline" "Discipline",
ADD COLUMN     "greScore" VARCHAR(50),
ALTER COLUMN "passportNumber" DROP NOT NULL,
ALTER COLUMN "passportExpiryDate" DROP NOT NULL;
