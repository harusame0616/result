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
export function succeed(): Success<undefined>;
/**
 * 成功値を持つResultを生成する関数（オーバーロード：引数あり）
 */
export function succeed<T>(data: T): Success<T>;
export function succeed<T>(data?: T): Success<T | undefined> {
	return { success: true, data };
}

/**
 * エラー値を持つResultを生成する関数
 */
export function fail<E>(error: E): Failure<E> {
	return { success: false, error };
}

/**
 * 例外をキャッチしてResultに変換する関数
 */
export function tryCatch<T, E = Error>(
	fn: () => T,
	onError?: (error: unknown) => E,
): Result<T, E> {
	try {
		return succeed(fn());
	} catch (error) {
		const errorValue = onError ? onError(error) : (error as E);
		return fail(errorValue);
	}
}

/**
 * 非同期関数をキャッチしてResultに変換する関数
 */
export async function tryCatchAsync<T, E = Error>(
	fn: () => Promise<T>,
	onError?: (error: unknown) => E,
): Promise<Result<T, E>> {
	try {
		const value = await fn();
		return succeed(value);
	} catch (error) {
		const errorValue = onError ? onError(error) : (error as E);
		return fail(errorValue);
	}
}
