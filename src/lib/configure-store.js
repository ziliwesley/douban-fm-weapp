// src/lib/configure-store.js

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from './utils/redux-persist-weapp.js';

import rootReducer from './reducer/index.js';
import rootSaga from './sagas/index.js';
import { appStart } from './actions/app-act.js';

const persistConfig = {
    storage: AsyncStorage,
    whitelist: [ 'doubanAuth', 'wechatAuth' ],
    debounce: 5000
};

export default function configureStore() {
    const middleware = [];
    const enhancers = [];

    // saga中间件
    const sagaMiddleware = createSagaMiddleware();
    middleware.push(sagaMiddleware);

    if (process.env.NODE_ENV === 'development') {
        const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED'];
        const logger = createLogger({
            predicate: (getState, { type }) => SAGA_LOGGING_BLACKLIST.indexOf(type) === -1,
            collapsed: true,
            diff: true
        });
        middleware.push(logger);
    }

    // 合并中间件
    enhancers.push(applyMiddleware(...middleware));
    // persist rehydrate
    enhancers.push(autoRehydrate());

    const store = createStore(rootReducer, compose(...enhancers));

    // init redux persist
    persistStore(store, persistConfig, () => {
        // dispatch startup action
        store.dispatch(appStart());
    });

    // kick off root saga
    sagaMiddleware.run(rootSaga);

    return store;
}
