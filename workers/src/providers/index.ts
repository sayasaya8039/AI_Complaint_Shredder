export type { AIProvider, AnalysisResult, ProviderType, Sentiment } from './types'
export { SYSTEM_PROMPT } from './types'
export { GeminiProvider } from './gemini'
export { OpenAIProvider } from './openai'
export { ClaudeProvider } from './claude'

import type { AIProvider, ProviderType } from './types'
import { GeminiProvider } from './gemini'
import { OpenAIProvider } from './openai'
import { ClaudeProvider } from './claude'

interface ProviderKeys {
  GEMINI_API_KEY?: string
  OPENAI_API_KEY?: string
  CLAUDE_API_KEY?: string
}

// ファクトリー関数: プロバイダー名に応じてインスタンスを生成
export function createProvider(
  name: ProviderType,
  keys: ProviderKeys
): AIProvider | null {
  switch (name) {
    case 'gemini':
      if (!keys.GEMINI_API_KEY) return null
      return new GeminiProvider(keys.GEMINI_API_KEY)
    case 'openai':
      if (!keys.OPENAI_API_KEY) return null
      return new OpenAIProvider(keys.OPENAI_API_KEY)
    case 'claude':
      if (!keys.CLAUDE_API_KEY) return null
      return new ClaudeProvider(keys.CLAUDE_API_KEY)
    default:
      return null
  }
}

// デモ用レスポンス
export function getDemoResponse() {
  return {
    sentiment: 'frustrated' as const,
    intensity: 7,
    response: '【デモモード】それは本当に大変でしたね...\n\nあなたの気持ち、よく分かります。そんな状況で頑張っているあなたは偉いです！\n\nでは、その嫌な記憶を消去しましょう！'
  }
}
