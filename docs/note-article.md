# 愚痴を吐いてAIに共感してもらい、シュレッダーで消す。完全プライベートなストレス解消アプリを作った

## はじめに

仕事や日常生活でストレスが溜まったとき、誰かに愚痴を聞いてほしい。でも相手の時間を奪うのも申し訳ない...そんな経験はありませんか？

そこで作ったのが「**AI愚痴聞きシュレッダー**」です。

**デモ**: https://ai-complaint-shredder.pages.dev

## どんなアプリ？

1. **愚痴を入力** - 思いの丈をぶちまける
2. **AIが共感** - 適切な共感メッセージを返す
3. **シュレッダーで消去** - 愚痴が物理的に破壊されるアニメーション

最大のポイントは**完全プライバシー**。データはサーバーに一切送信されません。すべてブラウザ内で完結します。

## 3つのAIから選べる

好きなAIプロバイダーを選択できます：

| AI | モデル | 特徴 |
|----|--------|------|
| **Gemini** | gemini-2.0-flash | 高速でコスパ良し |
| **OpenAI** | gpt-4o | 安定した品質 |
| **Claude** | claude-sonnet-4 | 自然な日本語 |

設定画面でワンクリック切り替え。使い比べてみてください。

## 使い方

### 1. APIキーを取得

使いたいAIのAPIキーを取得します：

- **Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Claude**: [Anthropic Console](https://console.anthropic.com/settings/keys)

### 2. 設定画面でAPIキーを入力

右上の歯車アイコンから設定画面を開き、使いたいAIを選択してAPIキーを入力。

### 3. 愚痴を吐き出す

テキストエリアに愚痴を入力して送信。AIが共感してくれます。

### 4. シュレッダーで消去

「シュレッド！」ボタンを押すと、愚痴のテキストが細切れになって落ちていくアニメーションが再生されます。

## プライバシーへのこだわり

このアプリは**完全クライアントサイド**で動作します。

```
┌─────────────────────────────────────────┐
│           あなたのブラウザ               │
│  ┌─────────────────────────────────┐   │
│  │  愚痴入力 → AI API呼び出し →    │   │
│  │  共感表示 → シュレッダー        │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  localStorage (APIキーのみ保存)         │
└─────────────────────────────────────────┘
              ↓ 直接通信
┌─────────────────────────────────────────┐
│  Gemini / OpenAI / Claude API           │
└─────────────────────────────────────────┘
```

- **サーバーなし**: 静的サイトとしてCloudflare Pagesにホスティング
- **データ保存なし**: 愚痴の内容はどこにも保存されない
- **APIキーはローカル保存**: ブラウザのlocalStorageに保存、サーバーには送信しない

愚痴という機密性の高いデータを扱うからこそ、このアーキテクチャを選びました。

## 技術スタック

**フロントエンド**
- React 19 + TypeScript
- Vite 7（爆速ビルド）
- Tailwind CSS 4
- Framer Motion（アニメーション）

**ホスティング**
- Cloudflare Pages（静的サイト）

**AI API**
- Google Generative AI SDK（Gemini用）
- OpenAI REST API
- Anthropic REST API

全部クライアントサイドで完結。サーバーコストゼロ。

## シュレッダーアニメーション

愚痴のテキストが細切れになって落ちていく、Framer Motionを使ったアニメーション。

```typescript
// テキストを1文字ずつ分解してアニメーション
{text.split('').map((char, i) => (
  <motion.span
    key={i}
    initial={{ y: 0, opacity: 1 }}
    animate={{
      y: 500,
      opacity: 0,
      rotate: Math.random() * 360,
    }}
    transition={{
      duration: 1.5,
      delay: i * 0.02,
    }}
  >
    {char}
  </motion.span>
))}
```

視覚的にも「消えた」という実感が得られます。

## 工夫したポイント

### 1. Strategy/Factoryパターン

3つのAIプロバイダーを統一インターフェースで抽象化：

```typescript
// 共通インターフェース
export async function getEmpathyResponse(
  complaint: string,
  provider: ProviderType,
  apiKeys: ApiKeys
): Promise<{ response: string; provider: ProviderType | 'demo' }>
```

プロバイダーを追加するときも、この関数の中にcase文を追加するだけ。

### 2. デモモード

APIキーがない場合は、テンプレートの共感メッセージを返すデモモードで動作。初めての人でもすぐ試せます。

### 3. CORSの回避

Claude APIはブラウザからの直接呼び出しを許可するヘッダーが必要：

```typescript
headers: {
  'anthropic-dangerous-direct-browser-access': 'true',
}
```

これで、サーバーを介さずにブラウザから直接Claude APIを呼び出せます。

## 開発のきっかけ

以前作った「Mental Health Journal」の共感AIと、「消す」という行為のカタルシスを組み合わせたらどうなるか、という実験から始まりました。

結果として、意外と実用的なストレス解消ツールになりました。

## コスト

- **ホスティング**: Cloudflare Pages無料枠
- **AI API**: 各プロバイダーの従量課金（1回の愚痴で約0.1円〜1円程度）

サーバーサイドのコストはゼロ。AI APIの費用だけで運用できます。

## 今後の予定

- 音声入力対応
- オフライン対応（PWA化）
- より派手なシュレッダーアニメーション

## 最後に

ストレスが溜まったら、ぜひ使ってみてください。愚痴は言葉にして、AIに受け止めてもらって、シュレッダーで消す。このサイクルが意外とスッキリします。

データは絶対に残らないので、安心して愚痴ってください。

**デモ**: https://ai-complaint-shredder.pages.dev
**GitHub**: https://github.com/sayasaya8039/AI_Complaint_Shredder

---

この記事が参考になったら、ぜひ「スキ」をお願いします！
