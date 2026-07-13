import { getAll as getAllSiteContent } from "../site-content/site-content.service.js";
import { getAll as getAllTestimonials } from "../testimonial/testimonial.service.js";
import { getAll as getAllPartners } from "../partner/partner.service.js";
import AppError from "../../shared/utils/appError.js";
import type { PageKey } from "./page.constants.js";

async function getHomePage() {
  const [siteContent, testimonials] = await Promise.all([
    getAllSiteContent({ page: "home" }),
    getAllTestimonials({ page: 1, limit: 3, isActive: true }),
  ]);

  return { siteContent, testimonials: testimonials.testimonials };
}

async function getAboutPage() {
  const [siteContent, partners] = await Promise.all([
    getAllSiteContent({ page: "about" }),
    getAllPartners({ page: 1, limit: 12, isActive: true }),
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
