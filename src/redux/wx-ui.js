import wx from 'labrador-immutable';
import { createAction, handleActions } from 'redux-actions';

export const NAVIGATE_TO = 'NAVIGATE_TO';
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';


// 页面切换
export const navigateTo = createAction(NAVIGATE_TO,
    pathname => {
        wx.navigateTo({ url: pathname });
        // For subsequent action or saga watcher
        return pathname;
    });

// 显示消息提示框
export const showToast = createAction(SHOW_TOAST,
    options => {
        wx.showToast(options);
        // For subsequent action or saga watcher
        return options;
    });

// 隐藏消息提示框
export const hideToast = createAction(HIDE_TOAST,
    () => {
        wx.hideToast();
    });
