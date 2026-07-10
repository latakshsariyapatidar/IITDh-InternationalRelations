import { prisma } from "../../config/prisma.js";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  ListTestimonialsQuery,
} from "./testimonial.schema.js";

export async function findAllTestimonials(query: ListTestimonialsQuery) {
  const where =
    query.isActive !== undefined ? { isActive: query.isActive } : {};
  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.testimonial.count({ where }),
  ]);
  return { testimonials, total, page: query.page, limit: query.limit };
}

export const findTestimonialById = (id: string) =>
  prisma.testimonial.findUnique({ where: { id } });
export const createTestimonial = (data: CreateTestimonialInput) =>
  prisma.testimonial.create({ data });
export const updateTestimonial = (id: string, data: UpdateTestimonialInput) =>
  prisma.testimonial.update({ where: { id }, data });
export const deleteTestimonial = (id: string) =>
  prisma.testimonial.delete({ where: { id } });
