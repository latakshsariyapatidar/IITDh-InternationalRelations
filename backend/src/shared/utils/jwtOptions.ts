import type { SignOptions, VerifyOptions } from "jsonwebtoken";

// One place that states how this API's tokens are signed and checked.
//
// `jwt.verify(token, secret)` with no options lets the *token* choose the
// algorithm through its own `alg` header, and the library then verifies it
// that way. That is the shape of the classic JWT confusion attacks, and the
// defence is simply to stop asking the token: the server decides, and a token
// that says anything else is rejected before its signature is looked at.
//
// `issuer` and `audience` are asserted for the same reason. All three token
// kinds here (admin, student, faculty) are signed with the same key, so
// without claims stating who minted a token and what it is for, any token this
// system signs is structurally a candidate for any check it performs. The
// role check in each middleware is what actually separates them; these claims
// make that boundary explicit rather than incidental.

export const JWT_ALGORITHM = "HS256" as const;
export const JWT_ISSUER = "iro.iitdh.ac.in";
export const JWT_AUDIENCE = "iro-api";

/** Access-token lifetime. Short because it cannot be revoked once issued. */
export const ACCESS_TOKEN_TTL = "15m";

export const ACCESS_TOKEN_SIGN_OPTIONS: SignOptions = {
  algorithm: JWT_ALGORITHM,
  expiresIn: ACCESS_TOKEN_TTL,
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

/**
 * Verification counterpart.
 *
 * `issuer` and `audience` are deliberately NOT asserted here. Tokens minted
 * before this was introduced do not carry them, and rejecting those would sign
 * out every admin and every campus user the moment this deploys. The algorithm
 * pin — the part that actually closes an attack — applies immediately.
 *
 * Once the longest refresh lifetime (7 days) has passed since deployment, add
 * `issuer: JWT_ISSUER, audience: JWT_AUDIENCE` below.
 */
export const ACCESS_TOKEN_VERIFY_OPTIONS: VerifyOptions = {
  algorithms: [JWT_ALGORITHM],
};
