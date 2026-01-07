# 愚痴を吐いてAIに共感してもらい、シュレッダーで消す。ストレス解消アプリを作った

## はじめに

仕事や日常生活でストレスが溜まったとき、誰かに愚痴を聞いてほしい。でも相手の時間を奪うのも申し訳ない...そんな経験はありませんか？

そこで作ったのが「**AI愚痴聞きシュレッダー**」です。

**デモ**: https://ai-complaint-shredder.pages.dev

## どんなアプリ？

1. **愚痴を入力** - 思いの丈をぶちまける
2. **AIが共感** - 感情を分析して、適切な共感メッセージを返す
3. **シュレッダーで消去** - 愚痴が物理的に破壊されるアニメーション

最大のポイントは**プライバシー重視**。シュレッダーボタンを押すと、データベースから完全に削除されます。「消した演出」ではなく、本当に消えます。

## 技術的な特徴

### マルチAIプロバイダー対応

3つのAIから選択できます：

- **Google Gemini 2.0 Flash** - 高速でコスパ良し
- **OpenAI GPT-4o** - 安定した品質
- **Anthropic Claude Sonnet 4** - 自然な日本語

設定画面でワンクリック切り替え。使い比べてみてください。

### 感情分析

入力された愚痴を6つの感情カテゴリに分類：

| 感情 | 絵文字 |
|------|--------|
| 怒り | 😤 |
| 悲しみ | 😢 |
| フラストレーション | 😣 |
| 不安 | 😰 |
| 疲労 | 😩 |
| 普通 | 😐 |

AIは検出した感情に合わせて、共感メッセージのトーンを調整します。

### シュレッダーアニメーション

愚痴のテキストが細切れになって落ちていく、Framer Motionを使ったアニメーション。視覚的にも「消えた」という実感が得られます。

## 技術スタック

**フロントエンド**
- React 19 + TypeScript
- Vite 7（爆速ビルド）
- Tailwind CSS 4
- Framer Motion（アニメーション）

**バックエンド**
- Cloudflare Workers（エッジコンピューティング）
- Hono（軽量Webフレームワーク）
- Cloudflare D1（SQLiteベースのDB）

**ホスティング**
- Cloudflare Pages（フロントエンド）
- Cloudflare Workers（API）

全部Cloudflareで完結。無料枠でかなり使えます。

## アーキテクチャ

```
┌─────────────────┐     ┌─────────────────┐
│  Cloudflare     │     │  Cloudflare     │
│  Pages          │────▶│  Workers        │
│  (Frontend)     │     │  (API)          │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │ Gemini  │ │ OpenAI  │ │ Claude  │
              └─────────┘ └─────────┘ └─────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Cloudflare D1  │
                        │  (SQLite)       │
                        └─────────────────┘
```

## 工夫したポイント

### 1. プライバシーファースト

- DBにはIDと内容のみ保存
- シュレッダー実行時に`DELETE`で完全消去
- IPアドレスやユーザー情報は一切保存しない

### 2. フォールバック設計

サーバーAPIが使えない場合、クライアントサイドでGemini APIを直接呼び出すフォールバック機能を実装。可用性を高めています。

### 3. Strategy/Factoryパターン

AIプロバイダーを抽象化し、新しいプロバイダーの追加が容易な設計：

```typescript
// 共通インターフェース
interface AIProvider {
  name: ProviderType
  analyze(complaint: string): Promise<AnalysisResult>
}

// ファクトリー関数
function createProvider(name: ProviderType, keys: ProviderKeys): AIProvider | null {
  switch (name) {
    case 'gemini': return new GeminiProvider(keys.GEMINI_API_KEY)
    case 'openai': return new OpenAIProvider(keys.OPENAI_API_KEY)
    case 'claude': return new ClaudeProvider(keys.CLAUDE_API_KEY)
  }
}
```

## 開発のきっかけ

以前作った「Mental Health Journal」の感情分析技術と、「PraiseWidget」の逆パターン（励ましではなく共感）を組み合わせたらどうなるか、という実験から始まりました。

結果として、意外と実用的なストレス解消ツールになりました。

## 今後の予定

- 音声入力対応
- より詳細な感情分析
- 統計ダッシュボード（匿名化）

## 最後に

ストレスが溜まったら、ぜひ使ってみてください。愚痴は言葉にして、AIに受け止めてもらって、シュレッダーで消す。このサイクルが意外とスッキリします。

**デモ**: https://ai-complaint-shredder.pages.dev
**GitHub**: https://github.com/sayasaya8039/AI_Complaint_Shredder

---

この記事が参考になったら、ぜひ「スキ」をお願いします！
