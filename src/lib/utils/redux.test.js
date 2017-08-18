// src/lib/utils/redux.test.js
import { shallowDiff } from './redux.js';

/* eslint-env jest */

describe('utils/redux', () => {

    it('shallowDiff(newInstance, next) should return duplicate of next', () => {
        const instanceA = {};
        const next = {
            propA: 'abcd',
            propB: 123,
            propC: []
        };

        const difference = shallowDiff(instanceA, next);
        expect(difference).toEqual(next);
        expect(difference).not.toBe(next);
    });

    it('shallowDiff(instance, next) should return plain object if nothing changed', () => {
        const instanceA = {};
        const initial = {
            propA: 'abcd',
            propB: 123,
            propC: []
        };
        const duplicate = {
            propA: 'abcd',
            propB: 123,
            propC: initial.propC
        };

        // Set initial state
        shallowDiff(instanceA, initial);
        const differenceA = shallowDiff(instanceA, initial);
        expect(differenceA).toEqual({});
        const differenceB = shallowDiff(instanceA, duplicate);
        expect(differenceB).toEqual({});
        expect(differenceB).not.toBe(differenceA);
    });

    it('shallowDiff(instance, next) should return diff if object reference changed', () => {
        const instanceA = {};
        const initial = {
            propA: 'abcd',
            propB: 123,
            propC: []
        };
        const mutated = {
            propA: 'abcd',
            propB: 123,
            // Not the same reference to initial.propC
            propC: []
        };

        // Set initial state
        shallowDiff(instanceA, initial);
        const difference = shallowDiff(instanceA, mutated);
        expect(difference).toEqual({
            propC: []
        });
        expect(difference.propC).toBe(mutated.propC);
        expect(difference.propC).not.toBe(initial.propC);
    });


    it('shallowDiff(instance, next) should only return differences from nextState', () => {
        const instanceA = {};
        const initial = {
            propA: 'abcd',
            propB: 123,
            propC: []
        };
        const next = {
            propC: [{
                key: 'value'
            }],
            propB: 123,
            propD: 'xyz'
        };

        // Set initial state
        shallowDiff(instanceA, initial);
        const difference = shallowDiff(instanceA, next);

        expect(difference).toEqual({
            propC: [{
                key: 'value'
            }],
            propD: 'xyz'
        });
    });

    it('shallowDiff(instance, next) should work with multiple instances', () => {
        const instanceA = {};
        const instanceB = {};
        const instanceC = instanceA;
        const nextA = {
            propA: 'abcd',
            propB: 123,
            propC: []
        };
        const nextB = {
            propA: 'abcd'
        };

        // Set initial state
        shallowDiff(instanceA, nextA);

        // Should only initialize state for instanceB
        const differenceA = shallowDiff(instanceB, nextB);
        expect(differenceA).toEqual(nextB);

        // instanceC and instanceA are essential the same reference
        const differenceB = shallowDiff(instanceC, nextB);
        expect(differenceB).toEqual({});
    });

    it('shallowDiff(instance, next) should work multiple times in a row', () => {
        const instanceA = {};
        const initial = {
            propA: 'abcd',
            propB: 123,
            propC: []
        };
        const objA = {
            propD: []
        };
        const objB = {
            propD: []
        };

        // Set initial state
        shallowDiff(instanceA, initial);

        const differenceA = shallowDiff(instanceA, objA);
        expect(differenceA).toEqual(objA);
        expect(differenceA.propD).toBe(objA.propD);

        const differenceB = shallowDiff(instanceA, objB);
        expect(differenceB).toEqual(objB);
        expect(differenceB.propD).toBe(objB.propD);
        expect(differenceB.propD).not.toBe(objA.propD);
    });

});
