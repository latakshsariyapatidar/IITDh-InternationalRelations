import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./partner.service.js";
import type {
  CreatePartnerInput,
  UpdatePartnerInput,
  ListPartnersQuery,
} from "./partner.schema.js";

export const listPartners = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Partners fetched",
        await service.getAll(req.query as unknown as ListPartnersQuery),
      ),
    );
});
export const getPartner = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Partner fetched",
        await service.getById(req.params.id as string),
      ),
    );
});
export const createPartner = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      successResponse(
        "Partner created",
        await service.create(req.body as CreatePartnerInput),
      ),
    );
});
export const updatePartner = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Partner updated",
        await service.update(
          req.params.id as string,
          req.body as UpdatePartnerInput,
        ),
      ),
    );
});
export const deletePartner = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Partner deleted"));
});
