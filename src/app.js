import { setStore } from 'labrador-redux';

import store from './redux';
import { STOP_MUSIC_SUCCESS } from './redux/player.js';


if (__DEV__) {
  console.log('当前为开发环境');
}

// 向labrador-redux注册store
setStore(store);

export default class Application {
    async onLaunch() {
        console.log('App started');
    }
}
