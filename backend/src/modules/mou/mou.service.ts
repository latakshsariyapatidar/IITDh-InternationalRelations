import path from "node:path";
import fs from "node:fs/promises";
import * as repo from "./mou.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
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

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. Without it a
 * listing returned MOUs the office had deliberately marked non-public — and
 * did so with `Cache-Control: public`, so a CDN could go on serving them.
 */
export async function getAll(query: ListMousQuery, isAdmin: boolean) {
  const result = await repo.findAllMous(query, isAdmin);
  return { ...result, mous: result.mous.map(toPublicShape) };
}

/**
 * Internal lookup that keeps `documentPath` — used by the download route.
 * `isAdmin` defaults to true because every other caller is already behind
 * `authenticate`.
 */
async function getRecord(id: string, isAdmin = true) {
  const item = await repo.findMouById(id);

  if (!item || !canSeeRecord(item, "isPublic", isAdmin)) {
    throw AppError.notFound("MOU not found");
  }

  return item;
}

export async function getById(id: string, isAdmin = true) {
  return toPublicShape(await getRecord(id, isAdmin));
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

/**
 * Deletes every MOU belonging to a partner, and the signed PDF each one owns.
 *
 * This exists because the database used to do it instead. `Mou.partner` was
 * `onDelete: Cascade`, so deleting a partner removed its MOU rows inside
 * Postgres — the application never ran, `remove` above never executed, and the
 * signed agreements stayed on disk forever with nothing referencing them. The
 * relation is `Restrict` now, which means the cascade has to be written out
 * here, where the file cleanup lives.
 */
export async function removeAllForPartner(partnerId: string): Promise<number> {
  const mous = await repo.findMousByPartner(partnerId);

  // Rows first: if file removal fails, the records are already gone and a
  // leftover file is recoverable. The other order can leave a row pointing at
  // a file that no longer exists.
  const { count } = await repo.deleteMousByPartner(partnerId);

  await Promise.all(
    mous
      .filter((mou) => mou.documentPath)
      .map((mou) =>
        fs
          .rm(path.join(MOU_UPLOAD_ROOT, mou.documentPath as string), { force: true })
          .catch(() => {}),
      ),
  );

  return count;
}

/** Absolute path of the signed document, for the authenticated download. */
export async function getDocumentAbsolutePath(
  id: string,
  isAdmin = true,
): Promise<string> {
  const mou = await getRecord(id, isAdmin);

  if (!mou.documentPath) {
    throw AppError.notFound("No document has been uploaded for this MOU");
  }

  return path.join(MOU_UPLOAD_ROOT, mou.documentPath);
}
