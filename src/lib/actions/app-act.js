// src/lib/actions/app-act.js
import { createAction } from 'redux-actions';

export const RELOAD = 'RELOAD';
export const RELOAD_COMPLETE = 'RELOAD_COMPLETE';

// export const APP_SHOW = 'APP_SHOW';
// export const APP_HIDE = 'APP_HIDE';
export const APP_START = 'APP_START';
export const APP_READY = 'APP_READY';

// 重新加载数据
export const reload = createAction(RELOAD);
export const reloadComplete = createAction(RELOAD_COMPLETE);

// 程序从后台回归
// export const appShow = createAction(APP_SHOW);
// 程序进入后台
// export const appHide = createAction(APP_HIDE);
// 程序启动
export const appStart = createAction(APP_START);
// 程序准备工作执行完毕
export const appReady = createAction(APP_READY);
