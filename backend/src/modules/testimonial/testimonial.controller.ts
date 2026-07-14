import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./testimonial.service.js";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  ListTestimonialsQuery,
} from "./testimonial.schema.js";

export const listTestimonials = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        successResponse(
          "Testimonials fetched",
          await service.getAll(req.query as unknown as ListTestimonialsQuery),
        ),
      );
  },
);
export const getTestimonial = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        successResponse(
          "Testimonial fetched",
          await service.getById(req.params.id as string),
        ),
      );
  },
);
export const createTestimonial = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(201)
      .json(
        successResponse(
          "Testimonial created",
          await service.create(req.body as CreateTestimonialInput),
        ),
      );
  },
);
export const updateTestimonial = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        successResponse(
          "Testimonial updated",
          await service.update(
            req.params.id as string,
            req.body as UpdateTestimonialInput,
          ),
        ),
      );
  },
);
export const deleteTestimonial = catchAsync(
  async (req: Request, res: Response) => {
    await service.remove(req.params.id as string);
    res.status(200).json(successResponse("Testimonial deleted"));
  },
);
