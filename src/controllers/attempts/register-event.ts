import { Request, Response } from "express";
import { z } from "zod";

import { mg } from "../../models";
import { throw_error } from "../../utils/throw-error";
import { HydratedDocument } from "mongoose";
import { TAttempt } from "../../models/attempt";
  
const z_attempt_id_params = z.object({
    attempt_id: z.string(),
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

export const register_event = async (req: Request, res: Response): Promise<Response> => {
    const { attempt_id } = z_attempt_id_params.parse(req.params);
    const { answers } = z_event_body.parse(req.body);
    const attempt = await mg.Attempt.findById(attempt_id) as HydratedDocument<TAttempt>;

    if (!attempt) {
      throw_error("Attempt not found", 404);
    }
  
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