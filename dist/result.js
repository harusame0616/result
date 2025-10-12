export function succeed(data) {
    return { success: true, data };
}
/**
 * エラー値を持つResultを生成する関数
 */
export function fail(error) {
    return { success: false, error };
}
/**
 * 例外をキャッチしてResultに変換する関数
 */
export function tryCatch(fn, onError) {
    try {
        return succeed(fn());
    }
    catch (error) {
        const errorValue = onError ? onError(error) : error;
        return fail(errorValue);
    }
}
/**
 * 非同期関数をキャッチしてResultに変換する関数
 */
export async function tryCatchAsync(fn, onError) {
    try {
        const value = await fn();
        return succeed(value);
    }
    catch (error) {
        const errorValue = onError ? onError(error) : error;
        return fail(errorValue);
    }
}
