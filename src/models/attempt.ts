import { Schema, Types, model } from 'mongoose'

export type TAttemptAnswer = {
  questionID: Types.ObjectId | string
  answers: string
}

export type TAttemptStatus = 'running' | 'submitted' | 'terminated' | 'expired'

export type TAttempt = {
  _id: Types.ObjectId
  candidate_id: Types.ObjectId
  status: TAttemptStatus
  durationSec: number
  startAt: Date
  endsAt: Date
  violationCount: number
  answers: TAttemptAnswer[]
  createdAt: Date
  updatedAt: Date
}

const answer_schema = new Schema<TAttemptAnswer>(
  {
    questionID: {
      type: Schema.Types.Mixed,
      required: true
    },
    answers: {
      type: String,
      required: false,
      default: ''
    }
  },
  { _id: false }
)

const attempt_schema = new Schema<TAttempt>(
  {
    candidate_id: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true
    },
    status: {
      type: String,
      enum: ['running', 'submitted', 'terminated', 'expired'],
      required: true,
      default: 'running'
    },
    durationSec: {
      type: Number,
      required: true,
      default: 0
    },
    startAt: {
      type: Date,
      required: true
    },
    endsAt: {
      type: Date,
      required: true
    },
    violationCount: {
      type: Number,
      required: true,
      default: 0
    },
    answers: {
      type: [answer_schema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export const AttemptModel = model<TAttempt>('Attempt', attempt_schema)
