import type { Request, Response } from "express";
import { loginWithGoogle, refresh, logout } from "./student-auth.service.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";
import {
  REFRESH_COOKIE_OPTIONS as STUDENT_COOKIE_OPTIONS,
  CLEAR_REFRESH_COOKIE_OPTIONS,
} from "../../shared/utils/refreshCookie.js";
import type { GoogleLoginInput } from "./student-auth.schema.js";

export const googleLoginController = catchAsync(async (req: Request, res: Response) => {
  const { idToken } = req.body as GoogleLoginInput;
  const tokens = await loginWithGoogle(idToken);
  res.cookie("studentRefreshToken", tokens.refreshToken, STUDENT_COOKIE_OPTIONS);
  // `role` tells the frontend which portal to open — students and faculty share
  // this one sign-in.
  res.status(200).json(
    successResponse("Signed in", {
      accessToken: tokens.accessToken,
      role: tokens.role,
      faculty: tokens.faculty ?? null,
    }),
  );
});

export const refreshController = catchAsync(async (req: Request, res: Response) => {
  const incoming = req.cookies.studentRefreshToken as string | undefined;
  if (!incoming) throw AppError.unauthorized("No active session — please sign in again");
  const tokens = await refresh(incoming);
  res.cookie("studentRefreshToken", tokens.refreshToken, STUDENT_COOKIE_OPTIONS);
  res.status(200).json(
    successResponse("Session refreshed", {
      accessToken: tokens.accessToken,
      role: tokens.role,
      faculty: tokens.faculty ?? null,
    }),
  );
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  const incoming = req.cookies.studentRefreshToken as string | undefined;
  if (incoming) await logout(incoming);
  res.clearCookie("studentRefreshToken", CLEAR_REFRESH_COOKIE_OPTIONS);
  res.status(200).json(successResponse("Signed out"));
});
