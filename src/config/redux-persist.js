import AsyncStorage from 'labrador-storage';

// Redux 数据持久化设置
const config = {
  storage: AsyncStorage,
  whitelist: [ 'doubanAuth', 'wechatAuth' ], // 可选，你【只想】存储的Redux store数据key列表
  transforms: [],
  // Otherwise wechat will whine about "setInterval(fn, 0)"
  debounce: 33
};

export default config;
