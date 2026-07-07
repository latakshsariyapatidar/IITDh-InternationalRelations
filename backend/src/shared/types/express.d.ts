declare global {
  namespace Express {
    interface Request {
      user?: {
        adminId: string;
        email: string;
      };
    }
  }
}

export {};
