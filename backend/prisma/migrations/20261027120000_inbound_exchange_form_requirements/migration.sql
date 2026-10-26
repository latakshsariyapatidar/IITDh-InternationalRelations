-- AlterEnum
ALTER TYPE "Discipline" ADD VALUE 'HUMANITIES';

-- AlterTable
ALTER TABLE "inbound_exchange_applications" ADD COLUMN     "acceptanceLetterPath" VARCHAR(500),
ADD COLUMN     "cvPath" VARCHAR(500),
ADD COLUMN     "discipline" "Discipline",
ADD COLUMN     "englishTestScore" VARCHAR(50),
ADD COLUMN     "englishTestType" "EnglishTestType",
ADD COLUMN     "highestQualification" VARCHAR(200),
ADD COLUMN     "previousGradeOrGPA" VARCHAR(100),
ADD COLUMN     "programAppliedFor" VARCHAR(20),
ALTER COLUMN "passportNumber" DROP NOT NULL,
ALTER COLUMN "passportExpiryDate" DROP NOT NULL;
