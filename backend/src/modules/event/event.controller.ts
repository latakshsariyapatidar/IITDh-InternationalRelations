import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./event.service.js";
import type {
  CreateEventInput,
  UpdateEventInput,
  ListEventsQuery,
} from "./event.schema.js";

export const listEvents = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Events fetched",
        await service.getAll(req.query as unknown as ListEventsQuery),
      ),
    );
});

export const getEvent = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Event fetched",
        await service.getById(req.params.id as string),
      ),
    );
});

export const createEvent = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      successResponse(
        "Event created",
        await service.create(req.body as CreateEventInput),
      ),
    );
});

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Event updated",
        await service.update(
          req.params.id as string,
          req.body as UpdateEventInput,
        ),
      ),
    );
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Event deleted"));
});
