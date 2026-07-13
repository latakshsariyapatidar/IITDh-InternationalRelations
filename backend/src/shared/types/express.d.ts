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
      };
    }
  }
}

export {};
