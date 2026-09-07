declare global {
  namespace Express {
    interface Request {
      user?: {
        adminId: string;
        email: string;
      };
      student?: {
        studentId: string;
        email: string;
        // Both campus roles come from the same Google sign-in; `facultyId` is
        // set only when the address matches the faculty directory.
        role: "student" | "faculty";
        facultyId?: string;
      };
    }
  }
}

export {};
