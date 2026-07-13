import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";
import AppError from "../../shared/utils/appError.js";

const ALLOWED_DOMAIN = "iitdh.ac.in";
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export interface VerifiedGoogleUser {
  email: string;
  name: string;
  googleSub: string;
}

export async function verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleUser> {
  let payload;

  try {
    const ticket = await client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    throw AppError.unauthorized("Invalid Google sign-in token");
  }

  if (!payload || !payload.email || !payload.sub) {
    throw AppError.unauthorized("Invalid Google sign-in token");
  }

  if (!payload.email_verified) {
    throw AppError.unauthorized("Google account email is not verified");
  }

  const isAllowedDomain =
    payload.hd === ALLOWED_DOMAIN || payload.email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);

  if (!isAllowedDomain) {
    throw AppError.forbidden(`Only ${ALLOWED_DOMAIN} accounts can access this feature`);
  }

  return {
    email: payload.email.toLowerCase(),
    name: payload.name ?? payload.email,
    googleSub: payload.sub,
  };
}
