---
paths: "**/*"
---

# bnmp 最優先ルール

## 概要

**bnmp**（Zig製高速パッケージマネージャー）を最優先で使用。
pnpm互換でさらに高速、ディスク効率が良い。

## 優先順位

| 順位 | ツール | 用途 |
|------|--------|------|
| 1 | **bnmp** | 最優先（bnmp.exe利用可能時） |
| 2 | pnpm | bnmp非対応時 |
| 3 | bun | pnpm非対応時 |
| 4 | npm | レガシー互換 |

## bnmp パス

```
D:Windows_appnmpzig-outinnmp.exe
```

## コマンド対応表

| npm/pnpm | bnmp |
|----------|------|
| npm install / pnpm install | bnmp install / bnmp i |
| npm i <pkg> / pnpm add <pkg> | bnmp add <pkg> / bnmp a <pkg> |
| npm uninstall / pnpm remove | bnmp remove / bnmp rm |

## 使用判断

| 条件 | 使用ツール |
|------|------------|
| bnmp.exe が存在する | bnmp |
| bnmp.exe が存在しない | pnpm |
| pnpm も使えない | bun または npm |

## 特徴

- Content-addressable store（pnpm互換）
- Hard linksでディスク効率化
- 厳格な依存関係解決
- 高速並列ダウンロード
- Zig製で軽量・高速
