/**
 * 成功を表す型
 * @example
 * const result: Success<number> = { success: true, data: 42 };
 * if (result.success) {
 *   console.log(result.data); // 42
 * }
 */
export type Success<T> = {
	success: true;
	data: T;
};

/**
 * 失敗を表す型
 * @example
 * const result: Failure<string> = { success: false, error: "エラー" };
 * if (!result.success) {
 *   console.log(result.error); // "エラー"
 * }
 */
export type Failure<E> = {
	success: false;
	error: E;
};

/**
 * Result型: 成功(Success)または失敗(Failure)を表す型
 * @example
 * const result: Result<number, string> = succeed(42);
 * if (result.success) {
 *   console.log(result.data); // 42
 * } else {
 *   console.log(result.error); // string型
 * }
 */
export type Result<T, E> = Success<T> | Failure<E>;

/**
 * 成功値を持つResultを生成する関数
 * @example
 * const result = succeed(42);
 * console.log(result); // { success: true, data: 42 }
 *
 * @example
 * const result = succeed();
 * console.log(result); // { success: true, data: undefined }
 */
export function succeed(): Success<undefined>;
export function succeed<T>(data: T): Success<T>;
export function succeed<T>(data?: T): Success<T | undefined> {
	return { success: true, data };
}

/**
 * エラー値を持つResultを生成する関数
 * @example
 * const result = fail("エラーが発生しました");
 * console.log(result); // { success: false, error: "エラーが発生しました" }
 */
export function fail<E>(error: E): Failure<E> {
	return { success: false, error };
}

/**
 * Success型から値の型を抽出
 */
type UnwrapSuccess<T> = T extends Success<infer U> ? U : T;

/**
 * Failure型からエラーの型を抽出
 */
type UnwrapFailure<E> = E extends Failure<infer U> ? U : E;

/**
 * 任意の型からFailure型を除外する型ヘルパー
 * @example
 * type A = string | number | Failure<Error>
 * type B = ExcludeFailure<A> // string | number
 */
export type ExcludeFailure<T> = Exclude<T, Failure<unknown>>;

/**
 * 任意の型からSuccess型のみを抽出する型ヘルパー
 * @example
 * type A = string | number | Success<string> | Failure<Error>
 * type B = ExtractSuccessType<A> // Success<string>
 */
export type ExtractSuccessType<T> = Extract<T, Success<unknown>>;

/**
 * 任意の型からFailure型のみを抽出する型ヘルパー
 * @example
 * type A = string | number | Success<string> | Failure<Error>
 * type B = ExtractFailure<A> // Failure<Error>
 */
export type ExtractFailure<T> = Extract<T, Failure<unknown>>;

/**
 * Result型かどうかを判定する型ガード
 * success プロパティが true の場合は data プロパティの存在を、
 * success プロパティが false の場合は error プロパティの存在を確認する
 */
function isResult(value: unknown): value is Result<unknown, unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		"success" in value &&
		typeof value.success === "boolean" &&
		((value.success === true && "data" in value) ||
			(value.success === false && "error" in value))
	);
}

/**
 * 例外をキャッチしてResultに変換する関数
 *
 * fnが通常の値を返す場合は、それをSuccessでラップします
 * fnがResult型を返す場合は、そのまま返します（Success/Failureの型を展開）
 * 例外が発生した場合は、onErrorで変換してFailureを返します
 *
 * @example
 * // 通常の値を返す場合
 * const result = tryCatch(() => 42);
 * // result: Result<number, Error>
 *
 * @example
 * // succeed を返す場合
 * const result = tryCatch(() => succeed("成功"));
 * // result: Result<string, Error>
 *
 * @example
 * // fail を返す場合
 * const result = tryCatch(() => fail("失敗"));
 * // result: Result<never, string | Error>
 *
 * @example
 * // 例外をキャッチする場合
 * const result = tryCatch(
 *   () => { throw new Error("エラー"); },
 *   (error) => `エラー: ${error}`
 * );
 * // result: Result<never, string>
 */
export function tryCatch<T, E = Error>(
	fn: () => T,
	onError?: (error: unknown) => E,
): Result<ExcludeFailure<UnwrapSuccess<T>>, UnwrapFailure<T> | E>;
export function tryCatch<T, E = Error>(
	fn: () => T,
	onError?: (error: unknown) => E,
): Result<ExcludeFailure<UnwrapSuccess<T>>, UnwrapFailure<T> | E> {
	try {
		const result = fn();

		if (isResult(result)) {
			return result as Result<
				ExcludeFailure<UnwrapSuccess<T>>,
				UnwrapFailure<T> | E
			>;
		}

		return succeed(result as ExcludeFailure<UnwrapSuccess<T>>);
	} catch (error) {
		const errorValue = onError ? onError(error) : (error as E);
		return fail(errorValue);
	}
}

/**
 * 非同期関数をキャッチしてResultに変換する関数
 *
 * fnが通常の値を返す場合は、それをSuccessでラップします
 * fnがResult型を返す場合は、そのまま返します（Success/Failureの型を展開）
 * 例外が発生した場合は、onErrorで変換してFailureを返します
 *
 * @example
 * // 通常の値を返す場合
 * const result = await tryCatchAsync(async () => 42);
 * // result: Result<number, Error>
 *
 * @example
 * // succeed を返す場合
 * const result = await tryCatchAsync(async () => succeed("成功"));
 * // result: Result<string, Error>
 *
 * @example
 * // fail を返す場合
 * const result = await tryCatchAsync(async () => fail("失敗"));
 * // result: Result<never, string | Error>
 *
 * @example
 * // 例外をキャッチする場合
 * const result = await tryCatchAsync(
 *   async () => { throw new Error("エラー"); },
 *   (error) => `エラー: ${error}`
 * );
 * // result: Result<never, string>
 */
export async function tryCatchAsync<T, E = Error>(
	fn: () => Promise<T>,
	onError?: (error: unknown) => E,
): Promise<
	Result<ExcludeFailure<UnwrapSuccess<T>>, E | UnwrapFailure<ExtractFailure<T>>>
>;
export async function tryCatchAsync<T, E = Error>(
	fn: () => Promise<T>,
	onError?: (error: unknown) => E,
): Promise<
	Result<ExcludeFailure<UnwrapSuccess<T>>, E | UnwrapFailure<ExtractFailure<T>>>
> {
	try {
		const result = await fn();

		if (isResult(result)) {
			return result as Result<
				ExcludeFailure<UnwrapSuccess<T>>,
				E | UnwrapFailure<ExtractFailure<T>>
			>;
		}

		return succeed(result as ExcludeFailure<UnwrapSuccess<T>>);
	} catch (error) {
		const errorValue = onError ? onError(error) : (error as E);
		return fail(errorValue);
	}
}
