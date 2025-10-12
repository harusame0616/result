import { expect, it } from "vitest";
import { fail, succeed, tryCatch, tryCatchAsync } from "./result";

it("succeed: データを渡すと success: true とデータを持つオブジェクトを返す", () => {
	const result = succeed(42);
	expect(result.success).toBe(true);
	expect(result.data).toBe(42);
});

it("succeed: 引数なしで呼び出すと undefined を返す", () => {
	const result = succeed();
	expect(result.success).toBe(true);
	expect(result.data).toBeUndefined();
});

it("fail: エラーを渡すと success: false とエラーを持つオブジェクトを返す", () => {
	const result = fail("error");
	expect(result.success).toBe(false);
	expect(result.error).toBe("error");
});

it("tryCatch: 例外が発生しない場合は成功を返す", () => {
	const result = tryCatch(() => 42);
	expect(result.success).toBe(true);
	if (result.success) {
		expect(result.data).toBe(42);
	}
});

it("tryCatch: 例外が発生した場合は失敗を返す", () => {
	const result = tryCatch(() => {
		throw new Error("test error");
	});
	expect(result.success).toBe(false);
});

it("tryCatch: onError でエラーを変換できる", () => {
	const result = tryCatch(
		() => {
			throw new Error("test error");
		},
		(e) => `Caught: ${(e as Error).message}`,
	);
	expect(result.success).toBe(false);
	if (!result.success) {
		expect(result.error).toBe("Caught: test error");
	}
});

it("tryCatchAsync: 例外が発生しない場合は成功を返す", async () => {
	const result = await tryCatchAsync(async () => 42);
	expect(result.success).toBe(true);
	if (result.success) {
		expect(result.data).toBe(42);
	}
});

it("tryCatchAsync: 例外が発生した場合は失敗を返す", async () => {
	const result = await tryCatchAsync(async () => {
		throw new Error("test error");
	});
	expect(result.success).toBe(false);
});

it("tryCatchAsync: onError でエラーを変換できる", async () => {
	const result = await tryCatchAsync(
		async () => {
			throw new Error("test error");
		},
		(e) => `Caught: ${(e as Error).message}`,
	);
	expect(result.success).toBe(false);
	if (!result.success) {
		expect(result.error).toBe("Caught: test error");
	}
});

// tryCatch で Result 型を返す場合のテスト
it("tryCatch: succeed を返すと Result の Success 側に展開される", () => {
	const result = tryCatch(() => succeed("成功"));

	expect(result.success).toBe(true);
	if (result.success) {
		expect(result.data).toBe("成功");
	}
});

it("tryCatch: fail を返すと Result の Failure 側に展開される", () => {
	const result = tryCatch(() => fail("失敗"));

	expect(result.success).toBe(false);
	if (!result.success) {
		expect(result.error).toBe("失敗");
	}
});

// tryCatchAsync で Result 型を返す場合のテスト
it("tryCatchAsync: succeed を返すと Result の Success 側に展開される", async () => {
	const result = await tryCatchAsync(async () => succeed("成功"));

	expect(result.success).toBe(true);
	if (result.success) {
		expect(result.data).toBe("成功");
	}
});

it("tryCatchAsync: fail を返すと Result の Failure 側に展開される", async () => {
	const result = await tryCatchAsync(async () => fail("失敗"));

	expect(result.success).toBe(false);
	if (!result.success) {
		expect(result.error).toBe("失敗");
	}
});
