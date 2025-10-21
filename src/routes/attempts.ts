import { Router, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import { z } from "zod";

import { AttemptModel, TAttempt } from "../models/attempt";
import { async_handler } from "../middlewares/async_handler";
import { throw_error } from "../utils/throw-error";
import { exam_duration_ms } from "../constants/exam";

const z_attempt_id_params = z.object({
    attempt_id: z.string(),
});

const z_create_attempt_body = z.object({
    candidate_id: z.string(),
});

const z_submit_attempt_body = z.object({
    answers: z.array(z.object({
        questionID: z.string(),
        answers: z.string().optional().default(""),
    })),
});

const z_event_body = z.object({
    type: z.enum([
        "window-blur",
        "window-focus-change",
        "fullscreen-exit",
        "copy-attempt",
        "paste-attempt",
        "devtools-open",
    ]),
    answers: z.array(z.object({
        questionID: z.string(),
        answers: z.string().optional().default(""),
    })).optional(),
});

const find_attempt_or_throw = async (attempt_id: string): Promise<HydratedDocument<TAttempt>> => {
    const attempt = await AttemptModel.findById(attempt_id);

    if (!attempt) {
        throw_error("Attempt not found", 404);
    }

    return attempt as HydratedDocument<TAttempt>;
};

const create_attempt = async ({ body }: Request, res: Response): Promise<Response> => {
    const { candidate_id } = z_create_attempt_body.parse(body);
    const start_at = new Date();
    const ends_at = new Date(start_at.getTime() + exam_duration_ms);

    const attempt = await AttemptModel.create({
        candidate_id,
        status: "running",
        durationSec: 0,
        startAt: start_at,
        endsAt: ends_at,
        violationCount: 0,
        answers: [],
    });

    return res.status(201).json({
        attempt_id: attempt._id.toString(),
        startAt: attempt.startAt,
        endsAt: attempt.endsAt,
    });
};


const submit_attempt = async (req: Request, res: Response): Promise<Response> => {
    const { attempt_id } = z_attempt_id_params.parse(req.params);
    const { answers } = z_submit_attempt_body.parse(req.body);
    const attempt = await find_attempt_or_throw(attempt_id);

    if (attempt.status !== "running") {
        return res.status(409).json({
            message: "Attempt is not active",
        });
    }

    const now = new Date();
    const final_status = now >= attempt.endsAt ? "terminated" : "submitted";

    // Update attempt with all answers at once
    attempt.answers = answers;
    attempt.status = final_status;
    attempt.durationSec = Math.floor((now.getTime() - attempt.startAt.getTime()) / 1000);
    await attempt.save();

    return res.status(204).send();
};

const register_event = async (req: Request, res: Response): Promise<Response> => {
    const { attempt_id } = z_attempt_id_params.parse(req.params);
    const { answers } = z_event_body.parse(req.body);
    const attempt = await find_attempt_or_throw(attempt_id);

    if (attempt.status !== "running") {
        return res.status(200).json({
            action: attempt.status,
        });
    }

    const now = new Date();

    if (now >= attempt.endsAt) {
        attempt.status = "terminated";
        attempt.durationSec = Math.floor((now.getTime() - attempt.startAt.getTime()) / 1000);
        if (answers && answers.length > 0) {
            attempt.answers = answers;
        }
        await attempt.save();

        return res.status(200).json({
            action: "terminate",
        });
    }

    attempt.violationCount += 1;

    // Save answers if provided (for both warning and termination)
    if (answers && answers.length > 0) {
        attempt.answers = answers;
    }

    if (attempt.violationCount === 1) {
        await attempt.save();

        return res.status(200).json({
            action: "warn",
        });
    }

    attempt.status = "terminated";
    attempt.durationSec = Math.floor((now.getTime() - attempt.startAt.getTime()) / 1000);
    await attempt.save();

    return res.status(200).json({
        action: "terminate",
    });
};

export const attempts_router = Router();

attempts_router.post("/", async_handler(create_attempt));
attempts_router.post("/:attempt_id/submit", async_handler(submit_attempt));
attempts_router.post("/:attempt_id/event", async_handler(register_event));