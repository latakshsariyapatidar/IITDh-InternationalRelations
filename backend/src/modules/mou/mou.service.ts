import path from "node:path";
import fs from "node:fs/promises";
import * as repo from "./mou.repository.js";
import AppError from "../../shared/utils/appError.js";
import { findPartnerById } from "../partner/partner.repository.js";
import { MOU_UPLOAD_ROOT } from "./mou.storage.js";
import type { CreateMouInput, UpdateMouInput, ListMousQuery } from "./mou.schema.js";

/**
 * Strips the stored path and reports only whether a document exists. The MOU
 * record itself is public; the signed document is not.
 */
function toPublicShape<T extends { documentPath: string | null }>(mou: T) {
  const { documentPath, ...rest } = mou;
  return { ...rest, hasDocument: documentPath !== null };
}

export async function getAll(query: ListMousQuery) {
  const result = await repo.findAllMous(query);
  return { ...result, mous: result.mous.map(toPublicShape) };
}

/** Internal lookup that keeps `documentPath` — used by the download route. */
async function getRecord(id: string) {
  const item = await repo.findMouById(id);
  if (!item) throw AppError.notFound("MOU not found");
  return item;
}

export async function getById(id: string) {
  return toPublicShape(await getRecord(id));
}

export async function create(data: CreateMouInput) {
  const partner = await findPartnerById(data.partnerId);
  if (!partner) throw AppError.badRequest("Selected partner does not exist");
  return toPublicShape(await repo.createMou(data));
}

export async function update(id: string, data: UpdateMouInput) {
  await getRecord(id);
  return toPublicShape(await repo.updateMou(id, data));
}

export async function remove(id: string) {
  const mou = await getRecord(id);
  await repo.deleteMou(id);

  if (mou.documentPath) {
    await fs.rm(path.join(MOU_UPLOAD_ROOT, mou.documentPath), { force: true }).catch(() => {});
  }
}

export async function attachDocument(id: string, storedFileName: string) {
  const mou = await getRecord(id);

  // Replacing a document should not leave the old file behind.
  if (mou.documentPath && mou.documentPath !== storedFileName) {
    await fs.rm(path.join(MOU_UPLOAD_ROOT, mou.documentPath), { force: true }).catch(() => {});
  }

  return toPublicShape(await repo.setMouDocumentPath(id, storedFileName));
}

/** Absolute path of the signed document, for the authenticated download. */
export async function getDocumentAbsolutePath(id: string): Promise<string> {
  const mou = await getRecord(id);

  if (!mou.documentPath) {
    throw AppError.notFound("No document has been uploaded for this MOU");
  }

  return path.join(MOU_UPLOAD_ROOT, mou.documentPath);
}
