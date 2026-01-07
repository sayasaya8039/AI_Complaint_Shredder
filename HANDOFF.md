# HANDOFF.md - AI_Complaint_Shredder

## プロジェクト状態
- **状態**: 初期化完了、開発待機中
- **作成日**: 2026年1月8日

---

## 🔴 絶対遵守ルール（コンテキスト圧縮後も維持）

### Tier 0 - 最重要
| ルール | 内容 |
|--------|------|
| **Gemini協力体制** | 壁打ち・調査で必ずGemini活用（中断禁止） |
| **ファイル書き込み** | Write/Edit禁止 → JSスクリプト経由のみ |
| **日本語回答** | 必ず日本語で回答 |
| **UI作成** | gpui最優先、egui第二選択 |
| **Git自動コミット** | 更新時は即座にコミット・プッシュ |

### Tier 1 - 必須
| ルール | 内容 |
|--------|------|
| **確認なし実行** | Yes/No確認せずタスク完了まで実行 |
| **ビルド完了** | デバッグ・ビルド・デプロイまで必ず完了 |
| **バージョン更新** | アプリ更新時は必ずバージョンアップ |
| **bnmp優先** | bnmp → pnpm → bun |
| **Biome使用** | ESLint+Prettier → Biome |
| **最新モデル確認** | AI API実装前にWebSearchで確認 |

---

## Gemini CLI

```bash
# フルパスで実行
"C:\Users\Owner\AppData\Roaming\npm\gemini.cmd" "質問内容"
```

### 壁打ち必須の場面
1. 新タスク開始時
2. 複雑な実装前
3. エラー発生時
4. 外部API・ライブラリ調査
5. コンテキスト圧縮直後

---

## ファイル書き込み手順

```
1. Write → C:/Users/Owner/.local/bin/temp-write.js
2. Bash → node C:/Users/Owner/.local/bin/temp-write.js
3. Bash → rm C:/Users/Owner/.local/bin/temp-write.js
```

---

## 開発環境

| ツール | バージョン | 優先度 |
|--------|-----------|--------|
| bnmp | 0.1+ | 1位 |
| pnpm | 10+ | 2位 |
| Bun | 1.3+ | 3位 |
| Biome | 1.9+ | Linter/Formatter |
| Rust | 1.75+ | GUI開発 |

---

## 次のステップ

AI_Complaint_Shredder の開発要件を決定：
- [ ] アプリ種類（Web/Windows/Chrome拡張）
- [ ] 主要機能の定義
- [ ] 技術スタック選定
