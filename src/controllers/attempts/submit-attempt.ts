import z from "zod";
import { Request, Response } from "express";
import { mg } from "../../models";
import { throw_error } from "../../utils/throw-error";
import { HydratedDocument } from "mongoose";
import { TAttempt } from "../../models/attempt";

const z_attempt_id_params = z.object({
    attempt_id: z.string(),
  });

const z_submit_attempt_body = z.object({
    answers: z.array(z.object({
      questionID: z.string(),
      answers: z.string().optional().default(""),
    })),
  });

export const submit_attempt = async (req: Request, res: Response): Promise<Response> => {
    const { attempt_id } = z_attempt_id_params.parse(req.params);
    const { answers } = z_submit_attempt_body.parse(req.body);
    const attempt = await mg.Attempt.findById(attempt_id) as HydratedDocument<TAttempt>;

    if (!attempt) {
      throw_error("Attempt not found", 404);
    }
  
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