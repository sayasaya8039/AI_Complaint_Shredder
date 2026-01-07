# AI愚痴聞きシュレッダー

愚痴を吐き出して、AIに共感してもらい、最後はシュレッダーで完全消去。ストレス解消のためのWebアプリです。

## デモ

https://ai-complaint-shredder.pages.dev

## 特徴

- **AIによる共感応答** - 愚痴に対して適切な共感メッセージを生成
- **マルチプロバイダー対応** - Gemini、OpenAI、Claudeから選択可能
- **完全クライアントサイド処理** - サーバーにデータを送信しない
- **プライバシー重視** - APIキーもデータもブラウザ内で完結
- **シュレッダーアニメーション** - 愚痴が物理的に破壊される演出

## 使い方

1. 設定画面（右上の歯車アイコン）を開く
2. 使いたいAIを選択（Gemini / OpenAI / Claude）
3. 選択したAIのAPIキーを入力して保存
4. 愚痴を入力して送信
5. AIの共感メッセージを読む
6. 「シュレッド！」ボタンで愚痴を消去

## 対応AIプロバイダー

| プロバイダー | モデル | APIキー取得先 |
|-------------|--------|--------------|
| Gemini | gemini-2.0-flash | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| OpenAI | gpt-4o | [OpenAI Platform](https://platform.openai.com/api-keys) |
| Claude | claude-sonnet-4 | [Anthropic Console](https://console.anthropic.com/settings/keys) |

## 技術スタック

### フロントエンド
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion

### ホスティング
- Cloudflare Pages

### AI API（クライアントサイド直接呼び出し）
- Google Generative AI SDK
- OpenAI REST API
- Anthropic REST API

## プライバシー

- **APIキー**: ブラウザのlocalStorageに保存（サーバー送信なし）
- **愚痴データ**: サーバーに一切保存しない
- **通信**: ブラウザから各AIプロバイダーへ直接通信

## ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/sayasaya8039/AI_Complaint_Shredder.git
cd AI_Complaint_Shredder

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

## デプロイ

```bash
# ビルド
npm run build

# Cloudflare Pagesにデプロイ
npx wrangler pages deploy dist --project-name=ai-complaint-shredder
```

## ライセンス

MIT

## 作者

[@sayasaya8039](https://github.com/sayasaya8039)
