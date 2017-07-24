import { takeLatest, effects } from 'redux-saga';
import wx from 'labrador-immutable';

const { put, call } = effects;

/**
 * 获取网络类型 Worker
 * @param {string} options.payload: pathname 页面路径
 */
export function* getNetworkType() {
    try {
        const res = yield call(wx.getNetworkType);
        // yield put(getNetworkTypeSuccess(res));
    } catch (err) {
        // yield put(getNetworkTypeFaiure(err));
    }
}

export default function* wxBridgeWatcher() {
    // yield takeLatest(GET_NETWORK_TYPE, showToastWorker);
}
