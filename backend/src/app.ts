import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
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
import uploadRouter from "./modules/upload/upload.routes.js";
import applicationRouter from "./modules/application/application.routes.js";
import siteContentRouter from "./modules/site-content/site-content.routes.js";
import statsRouter from "./modules/stats/stats.routes.js";
import pageRouter from "./modules/page/page.routes.js";
import mouRouter from "./modules/mou/mou.routes.js";
import studentAuthRouter from "./modules/student-auth/student-auth.routes.js";
import outboundApplicationRouter from "./modules/outbound-application/outbound-application.routes.js";

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

// // ------- Static files — publicly uploaded images/documents ------------------------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/site-content", siteContentRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/mous", mouRouter);
app.use("/api/v1/student-auth", studentAuthRouter);
app.use("/api/v1/outbound-applications", outboundApplicationRouter);

// // ------- 404 handler ------------------------
app.use((req: Request, _res: Response, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.path} not found`));
});

// // ------- Global error handler (must be last) -----------------
app.use(errorHandler);

export { app };
