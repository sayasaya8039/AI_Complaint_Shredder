// API設定
const API_BASE = import.meta.env.PROD
  ? 'https://ai-complaint-shredder-api.workers.dev'
  : 'http://localhost:8787'

export type Sentiment = 'angry' | 'sad' | 'frustrated' | 'anxious' | 'tired' | 'neutral'
export type ProviderType = 'gemini' | 'openai' | 'claude'

export interface ComplaintResponse {
  id: string
  provider: ProviderType | 'demo'
  sentiment: Sentiment
  intensity: number
  response: string
}

export interface ProvidersResponse {
  providers: ProviderType[]
  default: ProviderType | null
}

// 利用可能なプロバイダー一覧を取得
export async function getAvailableProviders(): Promise<ProvidersResponse> {
  const res = await fetch(`${API_BASE}/api/complaints/providers`)
  if (!res.ok) {
    return { providers: [], default: null }
  }
  return res.json()
}

// 愚痴を投稿（感情分析 + AI応答）
export async function submitComplaint(
  content: string,
  provider?: ProviderType
): Promise<ComplaintResponse> {
  const res = await fetch(`${API_BASE}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, provider }),
  })

  if (!res.ok) {
    throw new Error('API error')
  }

  return res.json()
}

// 愚痴を完全削除
export async function shredComplaint(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/complaints/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Delete failed')
  }
}
