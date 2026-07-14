import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./team.service.js";
import type {
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  ListTeamQuery,
} from "./team.schema.js";

export const listTeam = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Team fetched",
        await service.getAll(req.query as unknown as ListTeamQuery),
      ),
    );
});
export const getTeamMember = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Team member fetched",
        await service.getById(req.params.id as string),
      ),
    );
});
export const createTeamMember = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(201)
      .json(
        successResponse(
          "Team member created",
          await service.create(req.body as CreateTeamMemberInput),
        ),
      );
  },
);
export const updateTeamMember = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        successResponse(
          "Team member updated",
          await service.update(
            req.params.id as string,
            req.body as UpdateTeamMemberInput,
          ),
        ),
      );
  },
);
export const deleteTeamMember = catchAsync(
  async (req: Request, res: Response) => {
    await service.remove(req.params.id as string);
    res.status(200).json(successResponse("Team member deleted"));
  },
);
