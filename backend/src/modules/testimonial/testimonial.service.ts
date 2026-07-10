import * as repo from "./testimonial.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  ListTestimonialsQuery,
} from "./testimonial.schema.js";

export const getAll = (q: ListTestimonialsQuery) => repo.findAllTestimonials(q);

export async function getById(id: string) {
  const item = await repo.findTestimonialById(id);
  if (!item) throw AppError.notFound("Testimonial not found");
  return item;
}

export const create = (data: CreateTestimonialInput) =>
  repo.createTestimonial(data);
export async function update(id: string, data: UpdateTestimonialInput) {
  await getById(id);
  return repo.updateTestimonial(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteTestimonial(id);
}
