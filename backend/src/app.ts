import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
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
import inboundExchangeRouter from "./modules/inbound-exchange/inbound-exchange.routes.js";
import opportunityRouter from "./modules/opportunity/opportunity.routes.js";
import visitorRouter from "./modules/visitor/visitor.routes.js";
import notificationRouter from "./modules/notification/notification.routes.js";
import reportRouter from "./modules/report/report.routes.js";
import facultyPortalRouter from "./modules/faculty-portal/faculty-portal.routes.js";

const app: Express = express();

// // ------- Proxy awareness ------------------------
// Rate limiting keys on the client IP. Behind a reverse proxy every request
// arrives from the proxy's address, so without this one visitor's five
// submissions would exhaust the hourly budget for everyone.
app.set("trust proxy", env.TRUST_PROXY);

// // ------- Middleware ------------------------
app.use(
  helmet({
    // Uploaded images are embedded by the frontend, which is served from a
    // different origin; helmet's default `same-origin` policy would block them.
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Allow Google Sign-In popups/OneTap to communicate without COOP blocking postMessage
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);
// An explicit ceiling rather than the framework default, so raising it is a
// deliberate change. No endpoint accepts a JSON body near this size.
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // "Cookie" is not listed in allowedHeaders and "Set-Cookie" is not listed
    // in exposedHeaders, because both are forbidden header names: the browser
    // manages them itself and a page can neither set nor read them. Naming
    // them here did nothing except suggest they were what made credentialed
    // requests work. `credentials: true` is what does that.
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
);

// A backstop against scripted traffic, set well above what the admin panel
// needs. Endpoints with a real abuse case — sign-in, the public forms — carry
// their own much tighter limiters.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      status: "fail",
      message: "Too many requests. Please slow down and try again shortly.",
    },
  }),
);

// // ------- Static files — publicly uploaded images/documents ------------------------
//
// These files are uploaded by admins and served straight back from this API's
// origin, so they are treated as untrusted content that happens to live here:
//
//   nosniff        - the browser uses the declared type, and does not guess a
//                    more dangerous one from the bytes.
//   CSP sandbox    - anything script-capable that reaches this directory is
//                    inert when opened directly.
//   index: false   - no directory listings.
//   dotfiles: deny - nothing beginning with "." is served at all.
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    index: false,
    dotfiles: "deny",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      );
    },
  }),
);

// // ------- Health checks ------------------------
//
// Two endpoints on purpose. /api says the process is up and answering, which
// is all it ever said. /healthz additionally proves the thing the process
// exists to talk to is reachable, so an orchestrator stops sending traffic to
// a container that is running but cannot serve a single request.
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    message: "IRO Backend API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/healthz", (_req: Request, res: Response) => {
  void prisma
    .$queryRaw`SELECT 1`
    .then(() => {
      res.status(200).json({ status: "ok", database: "up" });
    })
    .catch((err: unknown) => {
      console.error("[HEALTH] Database check failed:", err);
      res.status(503).json({ status: "unavailable", database: "down" });
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
// Inbound degree admission. Also mounted at /api/v1/inbound-admissions, the
// clearer name now that inbound exchange is a separate register; the original
// path stays so the existing frontend keeps working.
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/inbound-admissions", applicationRouter);
app.use("/api/v1/inbound-exchange", inboundExchangeRouter);
app.use("/api/v1/site-content", siteContentRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/mous", mouRouter);
// One Google sign-in serves students and faculty; /campus-auth is the name
// that reflects that, with /student-auth kept for the existing frontend.
app.use("/api/v1/student-auth", studentAuthRouter);
app.use("/api/v1/campus-auth", studentAuthRouter);
app.use("/api/v1/outbound-applications", outboundApplicationRouter);
app.use("/api/v1/opportunities", opportunityRouter);
app.use("/api/v1/faculty-portal", facultyPortalRouter);
app.use("/api/v1/visitors", visitorRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/reports", reportRouter);

// // ------- 404 handler ------------------------
app.use((req: Request, _res: Response, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.path} not found`));
});

// // ------- Global error handler (must be last) -----------------
app.use(errorHandler);

export { app };
