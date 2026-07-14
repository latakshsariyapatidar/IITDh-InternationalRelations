import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./contact.service.js";
import type {
  CreateContactInput,
  UpdateContactInput,
  ListContactsQuery,
} from "./contact.schema.js";

export const listContacts = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Contacts fetched",
        await service.getAll(req.query as unknown as ListContactsQuery),
      ),
    );
});

export const getContact = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Contact fetched",
        await service.getById(req.params.id as string),
      ),
    );
});

export const createContact = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      successResponse(
        "Contact created",
        await service.create(req.body as CreateContactInput),
      ),
    );
});

export const updateContact = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Contact updated",
        await service.update(
          req.params.id as string,
          req.body as UpdateContactInput,
        ),
      ),
    );
});

export const deleteContact = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Contact deleted"));
});
