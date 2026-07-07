import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./shared/middleware/errorHandler.js";
import AppError from "./shared/utils/appError.js";

const app: Express = express();

// // ------- Middleware ------------------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

// // ------- Health check ------------------------
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    message: "IRO Backend API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// // ------- Routes ------------------------

// // ------- 404 handler ------------------------
app.use((req: Request, _res: Response, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.path} not found`));
});

// // ------- Global error handler (must be last) -----------------
app.use(errorHandler);

export { app };
