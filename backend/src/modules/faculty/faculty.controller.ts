import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./faculty.service.js";
import type {
  CreateFacultyInput,
  UpdateFacultyInput,
  ListFacultyQuery,
} from "./faculty.schema.js";

export const listFaculty = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Faculty fetched",
        await service.getAll(req.query as unknown as ListFacultyQuery),
      ),
    );
});
export const getFaculty = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Faculty member fetched",
        await service.getById(req.params.id as string),
      ),
    );
});
export const createFacultyMember = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(201)
      .json(
        successResponse(
          "Faculty member created",
          await service.create(req.body as CreateFacultyInput),
        ),
      );
  },
);
export const updateFacultyMember = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        successResponse(
          "Faculty member updated",
          await service.update(
            req.params.id as string,
            req.body as UpdateFacultyInput,
          ),
        ),
      );
  },
);
export const deleteFacultyMember = catchAsync(
  async (req: Request, res: Response) => {
    await service.remove(req.params.id as string);
    res.status(200).json(successResponse("Faculty member deleted"));
  },
);
