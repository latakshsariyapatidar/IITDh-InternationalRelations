export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  adminId: string;
  email: string;
}
