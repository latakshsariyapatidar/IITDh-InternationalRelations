import type { Request, Response, CookieOptions } from "express";
import { loginWithGoogle, refresh, logout } from "./student-auth.service.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { env } from "../../config/env.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";
import type { GoogleLoginInput } from "./student-auth.schema.js";

const STUDENT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  path: "/",
};

export const googleLoginController = catchAsync(async (req: Request, res: Response) => {
  const { idToken } = req.body as GoogleLoginInput;
  const tokens = await loginWithGoogle(idToken);
  res.cookie("studentRefreshToken", tokens.refreshToken, STUDENT_COOKIE_OPTIONS);
  res.status(200).json(successResponse("Signed in", { accessToken: tokens.accessToken }));
});

export const refreshController = catchAsync(async (req: Request, res: Response) => {
  const incoming = req.cookies.studentRefreshToken as string | undefined;
  if (!incoming) throw AppError.unauthorized("No active session — please sign in again");
  const tokens = await refresh(incoming);
  res.cookie("studentRefreshToken", tokens.refreshToken, STUDENT_COOKIE_OPTIONS);
  res.status(200).json(successResponse("Session refreshed", { accessToken: tokens.accessToken }));
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  const incoming = req.cookies.studentRefreshToken as string | undefined;
  if (incoming) await logout(incoming);
  res.clearCookie("studentRefreshToken", { path: "/" });
  res.status(200).json(successResponse("Signed out"));
});
