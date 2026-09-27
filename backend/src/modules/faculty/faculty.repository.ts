import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { visibilityFlagWhere } from "../../shared/utils/visibility.js";
import type {
  CreateFacultyInput,
  UpdateFacultyInput,
  ListFacultyQuery,
} from "./faculty.schema.js";

// This directory is public — the About page lists it — but it is also the
// faculty-portal allow-list: a Google sign-in whose verified @iitdh.ac.in
// address matches an active row with `isPortalEnabled` gets a faculty token
// instead of a student one.
//
// Both reads below used to run with no `select`, and Prisma's default is every
// scalar column. That was harmless while the table held only a name and a link.
// Once the portal added `email` and `isPortalEnabled` to the same row, the
// public listing started answering "which institute accounts hold privileged
// access" to anyone who asked — and the route carries `Cache-Control: public`,
// so a CDN would serve that answer too.
//
// `isAdmin` decides which *rows* are visible (see visibilityFlagWhere); these
// two projections decide which *columns*. They are separate questions and both
// have to be asked.
const PUBLIC_SELECT = {
  id: true,
  name: true,
  redirectUrl: true,
  // Rendered as a mailto link on the public About page, so it stays public.
  email: true,
  // Read by canSeeRecord() and by the About page's own filter.
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.FacultySelect;

// `isPortalEnabled` is the one column that is nobody's business but the
// office's. The admin panel needs it to drive its toggle.
const ADMIN_SELECT = {
  ...PUBLIC_SELECT,
  isPortalEnabled: true,
} satisfies Prisma.FacultySelect;

const selectFor = (isAdmin: boolean) => (isAdmin ? ADMIN_SELECT : PUBLIC_SELECT);

export async function findAllFaculty(query: ListFacultyQuery, isAdmin: boolean) {
  const where = visibilityFlagWhere("isActive", isAdmin, query.isActive);

  const [faculty, total] = await Promise.all([
    prisma.faculty.findMany({
      where,
      select: selectFor(isAdmin),
      orderBy: { name: "asc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.faculty.count({ where }),
  ]);

  return { faculty, total, page: query.page, limit: query.limit };
}

export const findFacultyById = (id: string, isAdmin: boolean) =>
  prisma.faculty.findUnique({ where: { id }, select: selectFor(isAdmin) });
export const createFaculty = (data: CreateFacultyInput) =>
  prisma.faculty.create({ data });
export const updateFaculty = (id: string, data: UpdateFacultyInput) =>
  prisma.faculty.update({ where: { id }, data });
export const deleteFaculty = (id: string) =>
  prisma.faculty.delete({ where: { id } });
