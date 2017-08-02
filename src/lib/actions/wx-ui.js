import wx from '../wx.js';
import { createAction } from 'redux-actions';

export const NAVIGATE_TO = 'NAVIGATE_TO';
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const SHOW_NAV_BAR_LOADING = 'SHOW_NAV_BAR_LOADING';
export const HIDE_NAV_BAR_LOADING = 'HIDE_NAV_BAR_LOADING';

// 页面切换
export const navigateTo = createAction(NAVIGATE_TO,
    pathname => {
        wx.navigateTo({ url: pathname });
        // For subsequent action or saga watcher
        return pathname;
    });

// 页面返回
export const navigateBack = createAction(NAVIGATE_TO,
    (delta = 1) => {
        wx.navigateBack({ delta });
        // For subsequent action or saga watcher
        return { delta };
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

// 导航栏显示加载状态
export const showNavigationBarLoading = createAction(SHOW_NAV_BAR_LOADING,
    () => {
        wx.showNavigationBarLoading()
    });

// 导航栏结束加载状态
export const hideNavigationBarLoading = createAction(HIDE_NAV_BAR_LOADING,
    () => {
        wx.hideNavigationBarLoading()
    });
