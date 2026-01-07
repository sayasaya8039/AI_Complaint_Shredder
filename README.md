# AI愚痴聞きシュレッダー

愚痴を吐き出して、AIに共感してもらい、最後はシュレッダーで完全消去。ストレス解消のためのWebアプリです。

## デモ

https://ai-complaint-shredder.pages.dev

## 特徴

- **AIによる共感応答** - 愚痴の感情を分析し、適切な共感メッセージを生成
- **マルチプロバイダー対応** - Gemini、OpenAI、Claudeから選択可能
- **プライバシー重視** - シュレッダー実行時にDBから完全削除
- **シュレッダーアニメーション** - 愚痴が物理的に破壊される演出

## 技術スタック

### フロントエンド
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion

### バックエンド
- Cloudflare Workers
- Hono (軽量Webフレームワーク)
- Cloudflare D1 (SQLite)

### AIプロバイダー
- Google Gemini 2.0 Flash
- OpenAI GPT-4o
- Anthropic Claude Sonnet 4

## セットアップ

### 必要条件
- Node.js 20+
- Cloudflareアカウント

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/sayasaya8039/AI_Complaint_Shredder.git
cd AI_Complaint_Shredder

# フロントエンドの依存関係をインストール
npm install

# Workersの依存関係をインストール
cd workers
npm install
```

### ローカル開発

```bash
# フロントエンド開発サーバー起動
npm run dev

# Workers開発サーバー起動（別ターミナル）
cd workers
npm run dev
```

### 本番デプロイ

```bash
# D1データベース作成（初回のみ）
cd workers
npx wrangler d1 create complaint-shredder

# wrangler.tomlにdatabase_idを設定後、マイグレーション実行
npx wrangler d1 migrations apply DB --remote

# APIキーを設定（使用するプロバイダーのみ）
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put CLAUDE_API_KEY

# Workersデプロイ
npx wrangler deploy

# フロントエンドビルド＆デプロイ
cd ..
npm run build
npx wrangler pages deploy dist --project-name=ai-complaint-shredder
```

## API仕様

### POST /api/complaints
愚痴を投稿し、感情分析とAI応答を取得

```json
{
  "content": "愚痴の内容",
  "provider": "gemini" // optional: gemini, openai, claude
}
```

### DELETE /api/complaints/:id
愚痴をDBから完全削除

### GET /api/complaints/providers
利用可能なAIプロバイダー一覧を取得

### GET /api/complaints/stats
匿名化された統計情報を取得

## 感情分析カテゴリ

| 感情 | 説明 |
|------|------|
| angry | 怒り |
| sad | 悲しみ |
| frustrated | フラストレーション |
| anxious | 不安 |
| tired | 疲労 |
| neutral | 普通 |

## ライセンス

MIT

## 作者

[@sayasaya8039](https://github.com/sayasaya8039)
