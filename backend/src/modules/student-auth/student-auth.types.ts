import type { CampusRole } from "../../shared/middleware/authenticateCampus.js";

export interface StudentTokenPayload {
  // Kept as `studentId` (not a renamed `accountId`) so existing tokens and
  // every route already reading `req.student.studentId` keep working.
  studentId: string;
  email: string;
  role: CampusRole;
  facultyId?: string;
}

export interface StudentAuthTokens {
  accessToken: string;
  refreshToken: string;
  role: CampusRole;
  faculty?: { id: string; name: string };
}
