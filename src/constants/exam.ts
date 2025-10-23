import { config } from '../config/config'

export const exam_duration_minutes = config.exam_duration_minutes

export const exam_duration_ms = exam_duration_minutes * 60_000
