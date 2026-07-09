import type { Request, Response, CookieOptions } from "express";
import { login, refresh, logout, logoutAll } from "./auth.service.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { env } from "../../config/env.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  path: "/",
};

export const loginController = catchAsync(
  async (req: Request, res: Response) => {
    const tokens = await login(req.body);
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
    res
      .status(200)
      .json(
        successResponse("Login successful", {
          accessToken: tokens.accessToken,
        }),
      );
  },
);

export const refreshController = catchAsync(
  async (req: Request, res: Response) => {
    const incoming = req.cookies.refreshToken as string | undefined;
    if (!incoming)
      throw AppError.unauthorized("No refresh token — please log in");
    const tokens = await refresh(incoming);
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
    res
      .status(200)
      .json(
        successResponse("Token refreshed", { accessToken: tokens.accessToken }),
      );
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    const incoming = req.cookies.refreshToken as string | undefined;
    if (incoming) await logout(incoming);
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json(successResponse("Logged out successfully"));
  },
);

export const logoutAllController = catchAsync(
  async (req: Request, res: Response) => {
    await logoutAll(req.user!.adminId);
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json(successResponse("Logged out from all devices"));
  },
);
