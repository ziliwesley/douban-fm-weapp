// src/app.js
import { store, actions } from './bundle.js';

const {
    startScheduler,
    stopScheduler
} = actions;

// 相关文档:
// https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/app.html

App({
    // 小程序初始化
    // 全局只触发一次
    onLaunch() {
        console.log('app launched!');
    },

    // 小程序显示
    // 或从后台进入前台显示
    onShow() {
        store.dispatch(startScheduler());
    },

    // 小程序隐藏
    // 或从前台进入后台
    onHide() {
        store.dispatch(stopScheduler());
    },

    // 错误监听
    onError(msg) {
        console.log(`Error happened: ${msg}`);
    }
});
