export interface StudentTokenPayload {
  studentId: string;
  email: string;
  role: "student";
}

export interface StudentAuthTokens {
  accessToken: string;
  refreshToken: string;
}
