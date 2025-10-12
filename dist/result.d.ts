/**
 * 成功を表す型
 */
export type Success<T> = {
    success: true;
    data: T;
};
/**
 * 失敗を表す型
 */
export type Failure<E> = {
    success: false;
    error: E;
};
/**
 * Result型: 成功(Success)または失敗(Failure)を表す型
 */
export type Result<T, E> = Success<T> | Failure<E>;
/**
 * 成功値を持つResultを生成する関数（オーバーロード：引数なし）
 */
export declare function succeed(): Success<undefined>;
/**
 * 成功値を持つResultを生成する関数（オーバーロード：引数あり）
 */
export declare function succeed<T>(data: T): Success<T>;
/**
 * エラー値を持つResultを生成する関数
 */
export declare function fail<E>(error: E): Failure<E>;
/**
 * 例外をキャッチしてResultに変換する関数
 */
export declare function tryCatch<T, E = Error>(fn: () => T, onError?: (error: unknown) => E): Result<T, E>;
/**
 * 非同期関数をキャッチしてResultに変換する関数
 */
export declare function tryCatchAsync<T, E = Error>(fn: () => Promise<T>, onError?: (error: unknown) => E): Promise<Result<T, E>>;
//# sourceMappingURL=result.d.ts.map