# @harusame0616/result

TypeScript向けの型安全なResult型ライブラリ

## 概要

プレーンオブジェクトベースのResult型をTypeScriptで提供します。エラーハンドリングを型安全に行うことができます。

## 特徴

- ✅ プレーンオブジェクト実装（シリアライズ可能）
- ✅ TypeScriptの型ガード（Discriminated Union）に対応
- ✅ 軽量・シンプルな API
- ✅ ビルド済みファイル同梱（インストール後すぐ使える）

## インストール

```bash
# npm経由でインストール
npm install @harusame0616/result
# または
pnpm add @harusame0616/result
# または
yarn add @harusame0616/result
```

## 使い方

### 基本的な使い方

```typescript
import { succeed, fail, type Result } from '@harusame0616/result';

// 成功値を返す
const success: Result<number, string> = succeed(42);

// エラー値を返す
const failure: Result<number, string> = fail('エラーが発生しました');

// 型ガードで値にアクセス
if (success.success) {
  console.log(success.data); // 42
}

if (!failure.success) {
  console.log(failure.error); // 'エラーが発生しました'
}
```

### 引数なしで呼び出す

```typescript
import { succeed } from '@harusame0616/result';

// 引数なしで呼び出すと undefined を返す
const result = succeed();
console.log(result.success); // true
console.log(result.data); // undefined
```

### 例外のキャッチ

```typescript
import { tryCatch, tryCatchAsync } from '@harusame0616/result';

// 同期関数
const result = tryCatch(
  () => JSON.parse('invalid json'),
  (e) => `Parse error: ${e}`
);

if (!result.success) {
  console.log(result.error); // Parse error: ...
}

// 非同期関数
const asyncResult = await tryCatchAsync(
  async () => {
    const response = await fetch('https://api.example.com');
    return response.json();
  },
  (e) => `Fetch error: ${e}`
);

if (asyncResult.success) {
  console.log(asyncResult.data); // レスポンスデータ
}
```

## API

### 型定義

#### Result<T, E>

成功（`Success<T>`）または失敗（`Failure<E>`）を表すユニオン型

```typescript
type Result<T, E> = Success<T> | Failure<E>;
```

#### Success<T>

成功を表す型

```typescript
type Success<T> = {
  success: true;
  data: T;
};
```

#### Failure<E>

失敗を表す型

```typescript
type Failure<E> = {
  success: false;
  error: E;
};
```

### 関数

#### succeed<T>(data: T): Success<T>

成功値を持つResultを生成

```typescript
const result = succeed(42);
// { success: true, data: 42 }
```

#### succeed(): Success<undefined>

引数なしで呼び出すと`undefined`を持つ成功を生成

```typescript
const result = succeed();
// { success: true, data: undefined }
```

#### fail<E>(error: E): Failure<E>

エラー値を持つResultを生成

```typescript
const result = fail('エラーメッセージ');
// { success: false, error: 'エラーメッセージ' }
```

### ユーティリティ関数

#### tryCatch<T, E>(fn: () => T, onError?: (error: unknown) => E): Result<T, E>

例外をキャッチしてResultに変換

```typescript
const result = tryCatch(
  () => JSON.parse('invalid'),
  (e) => `Parse failed: ${e}`
);
```

#### tryCatchAsync<T, E>(fn: () => Promise<T>, onError?: (error: unknown) => E): Promise<Result<T, E>>

非同期関数の例外をキャッチしてResultに変換

```typescript
const result = await tryCatchAsync(
  async () => await fetchData(),
  (e) => `Fetch failed: ${e}`
);
```

## 型ガード

Result型は TypeScript の Discriminated Union として実装されているため、`success`プロパティで型を絞り込めます。

```typescript
const result: Result<number, string> = succeed(42);

if (result.success) {
  // この中では result は Success<number> 型
  console.log(result.data); // number型としてアクセス可能
} else {
  // この中では result は Failure<string> 型
  console.log(result.error); // string型としてアクセス可能
}
```

## 開発

### リリース方法

GitHub Actions で自動的に npm に公開されます。

1. `package.json` の `version` を更新
2. 変更をコミット
3. Git タグを作成してプッシュ

```bash
# バージョンを更新（例: 1.0.0 → 1.0.1）
npm version patch  # または minor, major

# タグをプッシュ
git push --follow-tags
```

GitHub Actions が自動的にテスト・ビルド・npm への公開を実行します。

### 初回セットアップ

GitHub リポジトリの Settings > Secrets and variables > Actions から、以下のシークレットを設定してください：

- `NPM_TOKEN`: npm のアクセストークン（https://www.npmjs.com/settings/[username]/tokens から取得）

## ライセンス

MIT
