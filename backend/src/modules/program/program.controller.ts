import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./program.service.js";
import type {
  CreateProgramInput,
  UpdateProgramInput,
  ListProgramsQuery,
} from "./program.schema.js";

export const listPrograms = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Programs fetched",
        await service.getAll(req.query as unknown as ListProgramsQuery),
      ),
    );
});

export const getProgram = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Program fetched",
        await service.getById(req.params.id as string),
      ),
    );
});

export const createProgram = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      successResponse(
        "Program created",
        await service.create(req.body as CreateProgramInput),
      ),
    );
});

export const updateProgram = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Program updated",
        await service.update(
          req.params.id as string,
          req.body as UpdateProgramInput,
        ),
      ),
    );
});

export const deleteProgram = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Program deleted"));
});
