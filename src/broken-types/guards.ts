export function isDefined<T>(argument: T | undefined): argument is T {
    return argument !== undefined
}
// const foo: number[] = [1, 2, undefined, 4].filter(isDefined)

export function isTruthy<T>(argument: T | undefined): argument is T {
    return argument !== undefined && argument !== false && argument !== null && argument !== ""
}
// const foo: number[] = [1, 2, undefined, 4, false, null, ""].filter(isTruthy)