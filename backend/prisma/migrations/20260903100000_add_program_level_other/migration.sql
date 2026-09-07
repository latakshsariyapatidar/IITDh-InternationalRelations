-- AlterEnum
-- Inbound applicants can choose "Other (please specify)" as a program level.
-- Kept in its own migration: Postgres will not let a value added by
-- ALTER TYPE ... ADD VALUE be referenced inside the same transaction.
ALTER TYPE "ProgramLevel" ADD VALUE 'OTHER';
