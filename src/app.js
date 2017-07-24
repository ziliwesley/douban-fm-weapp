import { setStore } from 'labrador-redux';
import store from './redux';

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
