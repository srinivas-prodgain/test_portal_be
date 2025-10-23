import { Router } from 'express'

import { create_attempt } from '../controllers/attempts/create-attempt'
import { get_attempt } from '../controllers/attempts/get-attempt'
import { register_event } from '../controllers/attempts/register-event'
import { submit_attempt } from '../controllers/attempts/submit-attempt'
import { update_answer } from '../controllers/attempts/update-answer'
import { async_handler } from '../middlewares/async_handler'

export const attempts_router = Router()

attempts_router.get('/', async_handler(get_attempt))
attempts_router.post('/', async_handler(create_attempt))
attempts_router.post('/:attempt_id/submit', async_handler(submit_attempt))
attempts_router.post('/:attempt_id/event', async_handler(register_event))
attempts_router.patch('/:attempt_id/answer', async_handler(update_answer))
