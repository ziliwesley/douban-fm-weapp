// 基于
// https://github.com/maichong/labrador/blob/master/index.js

// 特别指定的wx对象中不进行Promise封装的方法
const hasNoPromiseMethods = {
    clearStorage: 1,
    hideToast: 1,
    showNavigationBarLoading: 1,
    hideNavigationBarLoading: 1,
    drawCanvas: 1,
    canvasToTempFilePath: 1,
    hideKeyboard: 1
};

const wxPromisified = {};

Object.keys(wx).forEach((key) => {
    if (hasNoPromiseMethods[key] ||                       // 特别指定的方法
        /^(on|create|stop|pause|close)/.test(key) ||   // 以on* create* stop* pause* close* 开头的方法
        /\w+Sync$/.test(key)) {                        // 以Sync结尾的方法
        // 不进行Promise封装
        wxPromisified[key] = function () {
            return wx[key].apply(wx, arguments);
        };
        return;
    }

    // 其余方法自动Promise化
    wxPromisified[key] = function (obj) {
        obj = obj || {};
        return new Promise((resolve, reject) => {
            obj.success = resolve;
            obj.fail = (res) => {
                if (res && res.errMsg) {
                    reject(new Error(res.errMsg));
                } else {
                    reject(res);
                }
            };
            wx[key](obj);
        });
    };
});

export default wxPromisified;
