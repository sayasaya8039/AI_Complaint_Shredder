---
paths: "**/*"
---

# pnpm / bnmp パッケージマネージャールール

## 概要

**bnmp**（利用可能時）または**pnpm**を優先パッケージマネージャーとして使用。

## 優先順位

| 順位 | ツール | 条件 |
|------|--------|------|
| 1 | **bnmp** | bnmp.exe が利用可能な場合 |
| 2 | **pnpm** | bnmp非対応時（デフォルト） |
| 3 | bun | pnpm非対応時 |
| 4 | npm | レガシー互換 |

## bnmp パス

```
D:Windows_appnmpzig-outinnmp.exe
```

## コマンド対応表

| npm | pnpm | bnmp |
|-----|------|------|
| npm install | pnpm install | bnmp i |
| npm i <pkg> | pnpm add <pkg> | bnmp a <pkg> |
| npm i -D <pkg> | pnpm add -D <pkg> | bnmp a -D <pkg> |
| npm uninstall | pnpm remove | bnmp rm |

## bnmpを使う場面

| 場面 | 使用 |
|------|------|
| 依存関係インストール | bnmp i |
| パッケージ追加 | bnmp a <pkg> |
| パッケージ削除 | bnmp rm <pkg> |

## pnpmを使う場面

| 場面 | 使用 |
|------|------|
| bnmp非対応機能 | pnpm |
| モノレポ | pnpm workspace |
| グローバルツール | pnpm add -g |
