import { Router, Request, Response } from "express";
import { z } from "zod";

import { CandidateModel } from "../models/candidate";
import { async_handler } from "../middlewares/async_handler";
import { throw_error } from "../utils/throw-error";

type TMongoServerError = Error & {
    code?: number;
};

const z_create_candidate_body = z.object({
    email: z.string(),
    linkedin_profile_url: z.string(),
    github_profile_url: z.string(),
    resume: z.string().optional(),
});

const create_candidate = async ({ body }: Request, res: Response): Promise<Response> => {
    const payload = z_create_candidate_body.parse(body);

    try {
        const candidate = await CandidateModel.create(payload);

        return res.status(201).json({
            candidate_id: candidate._id.toString(),
        });
    } catch (error) {
        const mongo_error = error as TMongoServerError;

        if (mongo_error.code === 11000) {
            throw_error("Candidate already exists", 409);
        }

        throw error;
    }
};

export const candidates_router = Router();

candidates_router.post("/", async_handler(create_candidate));
