// src/lib/actions/scheduler-act.js
import { createAction } from 'redux-actions';

export const SCHEDULER_START = 'SCHEDULER_START';
export const SCHEDULER_STOP = 'SCHEDULER_STOP';

export const startScheduler = createAction(SCHEDULER_START);
export const stopScheduler = createAction(SCHEDULER_STOP);
