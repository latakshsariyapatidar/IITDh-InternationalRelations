import { getAll as getAllSiteContent } from "../site-content/site-content.service.js";
import { getAll as getAllTestimonials } from "../testimonial/testimonial.service.js";
import { getAll as getAllPartners } from "../partner/partner.service.js";
import AppError from "../../shared/utils/appError.js";
import type { PageKey } from "./page.constants.js";

// The page aggregates are mounted on a public route with no authentication at
// all, so every module they call is asked as an anonymous caller. Passing
// `false` here is what keeps a deactivated testimonial or partner off the
// public home and about pages.
const AS_PUBLIC = false;

async function getHomePage() {
  const [siteContent, testimonials] = await Promise.all([
    getAllSiteContent({ page: "home" }),
    getAllTestimonials({ page: 1, limit: 3, isActive: true }, AS_PUBLIC),
  ]);

  return { siteContent, testimonials: testimonials.testimonials };
}

async function getAboutPage() {
  const [siteContent, partners] = await Promise.all([
    getAllSiteContent({ page: "about" }),
    getAllPartners({ page: 1, limit: 12, isActive: true, sortBy: "type" }, AS_PUBLIC),
  ]);

  return { siteContent, partners: partners.partners };
}

async function getAdmissionPage() {
  const siteContent = await getAllSiteContent({ page: "admission" });
  return { siteContent };
}

export async function getPage(key: PageKey) {
  switch (key) {
    case "home":
      return getHomePage();
    case "about":
      return getAboutPage();
    case "admission":
      return getAdmissionPage();
    default:
      throw AppError.notFound(`No aggregate defined for page "${key}"`);
  }
}
