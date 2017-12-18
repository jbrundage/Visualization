import { hashSum } from "./hashSum";

export function debounce<R extends Promise<any>>(fn: () => R, timeout?: number): () => R;
export function debounce<P1, R extends Promise<any>>(fn: (param1: P1) => R, timeout?: number): (param1: P1) => R;
export function debounce<P1, P2, R extends Promise<any>>(fn: (param1: P1, param2: P2) => R, timeout?: number): (param1: P1, param2: P2) => R;
export function debounce<P1, P2, P3, R extends Promise<any>>(fn: (param1: P1, param2: P2, param3: P3) => R, timeout?: number): (param1: P1, param2: P2, param3: P3) => R;
export function debounce<P1, P2, P3, P4, R extends Promise<any>>(fn: (param1: P1, param2: P2, param3: P3, param4: P4) => R, timeout?: number): (param1: P1, param2: P2, param3: P3, param4: P4) => R;
export function debounce<TParam, R extends Promise<any>>(fn: (...params: TParam[]) => R, timeout?: number): (...params: TParam[]) => R {
    const promises: { [key: string]: { promise: R, clockStart: number } } = {};

    return (...params) => {
        const hash = hashSum(params);
        if (!promises[hash]) {
            promises[hash] = {
                promise: fn(...params).then(response => {
                    if (timeout === undefined) {
                        this.promise = null;
                    } else {
                        setTimeout(() => {
                            this.promise = null;
                        }, Math.max(timeout - (Date.now() - this.clockStart), 0));
                    }
                    return response;
                }).catch(e => {
                    this.promise = null;
                    throw e;
                }) as R,
                clockStart: Date.now()
            };
        }
        return promises[hash].promise;
    };
}
