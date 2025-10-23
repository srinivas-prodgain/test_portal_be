import { AttemptModel } from './attempt'
import { CandidateModel } from './candidate'
import { QuestionModel } from './question'

export type TMg = {
  User: typeof CandidateModel
  Candidate: typeof CandidateModel
  Question: typeof QuestionModel
  Attempt: typeof AttemptModel
}

export const mg: TMg = {
  User: CandidateModel,
  Candidate: CandidateModel,
  Question: QuestionModel,
  Attempt: AttemptModel
}
