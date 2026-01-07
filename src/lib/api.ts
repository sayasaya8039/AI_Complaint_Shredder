// API設定
const API_BASE = import.meta.env.PROD
  ? 'https://ai-complaint-shredder-api.workers.dev'
  : 'http://localhost:8787'

export type Sentiment = 'angry' | 'sad' | 'frustrated' | 'anxious' | 'tired' | 'neutral'

export interface ComplaintResponse {
  id: string
  sentiment: Sentiment
  intensity: number
  response: string
}

// 愚痴を投稿（感情分析 + AI応答）
export async function submitComplaint(content: string): Promise<ComplaintResponse> {
  const res = await fetch(`${API_BASE}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
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

// フォールバック（API未接続時）
export async function getEmpathyResponseWithApi(complaint: string): Promise<ComplaintResponse | null> {
  try {
    return await submitComplaint(complaint)
  } catch {
    return null
  }
}
