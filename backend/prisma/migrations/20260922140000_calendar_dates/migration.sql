-- Calendar-day facts move from timestamptz to date.
--
-- A date of birth, a passport expiry, a visa expiry, a joining or exit date
-- and a visit period are all *days*, not moments. Stored as timestamptz they
-- were pinned to midnight UTC, which reads as the previous day anywhere west
-- of UTC: an exported sheet showed a partner university in Europe or North
-- America a date of birth one day early. `date` has no time and no zone, so
-- there is nothing left to shift.
--
-- The USING clause converts explicitly at UTC rather than relying on the
-- session timezone, so the day that comes out is the day that was stored --
-- regardless of what timezone this migration happens to run in.

-- AlterTable
ALTER TABLE "student_applications"
  ALTER COLUMN "dateOfBirth"        TYPE DATE USING ("dateOfBirth"        AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "passportExpiryDate" TYPE DATE USING ("passportExpiryDate" AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "dateOfJoining"      TYPE DATE USING ("dateOfJoining"      AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "exitDate"           TYPE DATE USING ("exitDate"           AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "passportIssueDate"  TYPE DATE USING ("passportIssueDate"  AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "visaIssueDate"      TYPE DATE USING ("visaIssueDate"      AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "visaExpiryDate"     TYPE DATE USING ("visaExpiryDate"     AT TIME ZONE 'UTC')::date;

-- AlterTable
ALTER TABLE "inbound_exchange_applications"
  ALTER COLUMN "dateOfBirth"        TYPE DATE USING ("dateOfBirth"        AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "passportExpiryDate" TYPE DATE USING ("passportExpiryDate" AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "intendedStayFrom"   TYPE DATE USING ("intendedStayFrom"   AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "intendedStayTo"     TYPE DATE USING ("intendedStayTo"     AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "dateOfJoining"      TYPE DATE USING ("dateOfJoining"      AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "exitDate"           TYPE DATE USING ("exitDate"           AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "passportIssueDate"  TYPE DATE USING ("passportIssueDate"  AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "visaIssueDate"      TYPE DATE USING ("visaIssueDate"      AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "visaExpiryDate"     TYPE DATE USING ("visaExpiryDate"     AT TIME ZONE 'UTC')::date;

-- AlterTable
ALTER TABLE "mous"
  ALTER COLUMN "signedDate" TYPE DATE USING ("signedDate" AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "expiryDate" TYPE DATE USING ("expiryDate" AT TIME ZONE 'UTC')::date;

-- AlterTable
ALTER TABLE "visitors"
  ALTER COLUMN "visitFrom" TYPE DATE USING ("visitFrom" AT TIME ZONE 'UTC')::date,
  ALTER COLUMN "visitTo"   TYPE DATE USING ("visitTo"   AT TIME ZONE 'UTC')::date;
