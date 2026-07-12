import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./shared/middleware/errorHandler.js";
import AppError from "./shared/utils/appError.js";

import authRouter from "./modules/auth/auth.routes.js";
import announcementRouter from "./modules/announcement/announcement.routes.js";
import partnerRouter from "./modules/partner/partner.routes.js";
import facultyRouter from "./modules/faculty/faculty.routes.js";
import teamRouter from "./modules/team/team.routes.js";
import testimonialRouter from "./modules/testimonial/testimonial.routes.js";
import faqRouter from "./modules/faq/faq.routes.js";
import galleryRouter from "./modules/gallery/gallery.routes.js";
import downloadRouter from "./modules/download/download.routes.js";
import programRouter from "./modules/program/program.routes.js";
import eventRouter from "./modules/event/event.routes.js";
import contactRouter from "./modules/contact/contact.routes.js";

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
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/announcements", announcementRouter);
app.use("/api/v1/partners", partnerRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/faqs", faqRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/downloads", downloadRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/contacts", contactRouter);

// // ------- 404 handler ------------------------
app.use((req: Request, _res: Response, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.path} not found`));
});

// // ------- Global error handler (must be last) -----------------
app.use(errorHandler);

export { app };
