import { Schema, model, Types } from "mongoose";

export type TCandidate = {
    _id: Types.ObjectId;
    email: string;
    linkedin_profile_url: string;
    github_profile_url: string;
    resume?: string;
    createdAt: Date;
    updatedAt: Date;
};

const candidate_schema = new Schema<TCandidate>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        linkedin_profile_url: {
            type: String,
            required: true,
            unique: true,
        },
        github_profile_url: {
            type: String,
            required: true,
            unique: true,
        },
        resume: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

export const CandidateModel = model<TCandidate>("Candidate", candidate_schema);
