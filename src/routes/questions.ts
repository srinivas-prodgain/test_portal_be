import { Router } from 'express'

import { get_questions } from '../controllers/questions/get-questions'
import { async_handler } from '../middlewares/async_handler'

export const questions_router = Router()

questions_router.get('/', async_handler(get_questions))
