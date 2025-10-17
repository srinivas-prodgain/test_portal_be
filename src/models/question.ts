import { Schema, model, Types } from "mongoose";

export type TQuestion = {
    _id: Types.ObjectId;
    question: string;
    createdAt: Date;
    updatedAt: Date;
};

const question_schema = new Schema<TQuestion>(
    {
        question: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

question_schema.virtual("id").get(function (this: TQuestion) {
    return this._id;
});

export const QuestionModel = model<TQuestion>("Question", question_schema);
