
const prevStates = new WeakMap();

/**
 * Perform a shallow diff between next State and previous
 * state
 * @param  {Page|App} instance
 * @param  {Object}   nextState 
 * @return {Object}
 */
export function shallowDiff(instance, nextState) {
    let difference;

    // Initialize
    if (!prevStates.has(instance)) {
        prevStates.set(instance, nextState);
        difference = { ...nextState };
    } else {
        let prevState = prevStates.get(instance);

        // Same reference
        if (prevState === nextState) {
            difference = {};
        } else {
            difference = Object.keys(nextState).reduce((memo, key) => {
                if (nextState[key] !== prevState[key]) {
                    memo[key] = nextState[key];
                }

                return memo;
            }, {});
        }
    }

    if (process.env.NODE_ENV === 'development') {
        if (Object.keys(difference).length) {
            console.log('shallowDiff(): Found Diff', difference);
        } else {
            console.log('shallowDiff(): No Diff Found.');
        }
    }

    prevStates.set(instance, nextState);
    return difference;
}
