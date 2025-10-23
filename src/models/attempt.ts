import { Schema, Types, model } from 'mongoose'

export type TAttemptAnswer = {
  question_id: Types.ObjectId | string
  answers: string
}

export type TViolationType =
  | 'window-blur'
  | 'window-focus-change'
  | 'devtools-open'
  | 'fullscreen'

export type TAttemptViolation = {
  type: TViolationType
  timestamp: Date
}

export type TAttemptStatus = 'running' | 'submitted' | 'auto_submitted' | 'terminated'

export type TAttempt = {
  _id: Types.ObjectId
  candidate_id: Types.ObjectId
  status: TAttemptStatus
  duration_sec: number
  start_at: Date
  ends_at: Date
  violation_count: number
  violations: TAttemptViolation[]
  answers: TAttemptAnswer[]
  createdAt: Date
  updatedAt: Date
}

const answer_schema = new Schema<TAttemptAnswer>(
  {
    question_id: {
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

const violation_schema = new Schema<TAttemptViolation>(
  {
    type: {
      type: String,
      enum: ['window-blur', 'window-focus-change', 'devtools-open', 'fullscreen'],
      required: true
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now
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
      enum: ['running', 'submitted', 'auto_submitted', 'terminated'],
      required: true,
      default: 'running'
    },
    duration_sec: {
      type: Number,
      required: true,
      default: 0
    },
    start_at: {
      type: Date,
      required: true
    },
    ends_at: {
      type: Date,
      required: true
    },
    violation_count: {
      type: Number,
      required: true,
      default: 0
    },
    violations: {
      type: [violation_schema],
      default: []
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
