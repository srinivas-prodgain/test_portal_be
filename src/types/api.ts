export type TPagination = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type TApiResponse<T = Record<string, any>> = {
  message: string
  data?: T
  pagination?: TPagination
}

export type TApiErrorResponse = {
  message: string
}

// Specific response types for our endpoints
export type TAttemptViolation = {
  type: 'window-blur' | 'window-focus-change' | 'devtools-open' | 'fullscreen'
  timestamp: Date
}

export type TAttemptData = {
  attempt_id: string
  start_at: Date
  ends_at: Date
  status?: string
  violation_count?: number
  violations?: TAttemptViolation[]
  answers?: Array<{
    question_id: string
    answers: string
  }>
}

export type TQuestionData = {
  question_id: string
  question: string
}

export type TQuestionsData = {
  questions: TQuestionData[]
}

export type TRegisterEventData = {
  action: 'warn' | 'terminate' | string
  violation_count: number
}

export type TUpdateAnswerData = {
  question_id: string
  answers: string
}
