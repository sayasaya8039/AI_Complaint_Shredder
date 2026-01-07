// AIプロバイダー共通インターフェース
export type Sentiment = 'angry' | 'sad' | 'frustrated' | 'anxious' | 'tired' | 'neutral'

export interface AnalysisResult {
  sentiment: Sentiment
  intensity: number // 1-10
  response: string
}

export type ProviderType = 'gemini' | 'openai' | 'claude'

export interface AIProvider {
  name: ProviderType
  analyze(complaint: string): Promise<AnalysisResult>
}

export const SYSTEM_PROMPT = `あなたは「愚痴聞きシュレッダー」のAIアシスタントです。
ユーザーの愚痴に対して、以下の形式でJSON応答してください：

{
  "sentiment": "angry" | "sad" | "frustrated" | "anxious" | "tired" | "neutral",
  "intensity": 1-10の数値（感情の強さ）,
  "response": "共感メッセージ（最後は必ず「では、その嫌な記憶を消去しましょう！」で終わる）"
}

共感のポイント：
- まず感情を受け止める（「それは本当に〇〇ですね」）
- 具体的な状況への理解を示す
- 過剰なくらい味方になる
- 最後は必ず「では、その嫌な記憶を消去しましょう！」で締める`
