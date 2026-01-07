import { Hono } from 'hono'
import { createProvider, getDemoResponse, type ProviderType } from '../providers'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
  OPENAI_API_KEY?: string
  CLAUDE_API_KEY?: string
}

export const complaintRoutes = new Hono<{ Bindings: Bindings }>()

// 利用可能なプロバイダー一覧を取得
complaintRoutes.get('/providers', (c) => {
  const available: ProviderType[] = []
  if (c.env.GEMINI_API_KEY) available.push('gemini')
  if (c.env.OPENAI_API_KEY) available.push('openai')
  if (c.env.CLAUDE_API_KEY) available.push('claude')

  return c.json({
    providers: available,
    default: available[0] || null,
  })
})

// 愚痴を投稿（感情分析 + AI応答 + DB保存）
complaintRoutes.post('/', async (c) => {
  const body = await c.req.json<{ content: string; provider?: ProviderType }>()
  const { content, provider: requestedProvider } = body

  if (!content || content.trim().length === 0) {
    return c.json({ error: '愚痴を入力してください' }, 400)
  }

  // プロバイダーを決定（リクエストで指定がなければ利用可能な最初のもの）
  const providerName: ProviderType = requestedProvider ||
    (c.env.GEMINI_API_KEY ? 'gemini' : c.env.OPENAI_API_KEY ? 'openai' : 'claude')

  const aiProvider = createProvider(providerName, {
    GEMINI_API_KEY: c.env.GEMINI_API_KEY,
    OPENAI_API_KEY: c.env.OPENAI_API_KEY,
    CLAUDE_API_KEY: c.env.CLAUDE_API_KEY,
  })

  let analysis
  if (aiProvider) {
    try {
      analysis = await aiProvider.analyze(content)
    } catch (error) {
      console.error('AI provider error:', error)
      analysis = getDemoResponse()
    }
  } else {
    analysis = getDemoResponse()
  }

  // D1に一時保存（後で完全削除するため）
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    'INSERT INTO complaints (id, content, sentiment, intensity, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, content, analysis.sentiment, analysis.intensity, now).run()

  return c.json({
    id,
    provider: aiProvider?.name || 'demo',
    sentiment: analysis.sentiment,
    intensity: analysis.intensity,
    response: analysis.response,
  })
})

// 愚痴を完全削除（シュレッダー実行時）
complaintRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')

  // D1から完全削除
  const result = await c.env.DB.prepare(
    'DELETE FROM complaints WHERE id = ?'
  ).bind(id).run()

  if (result.meta.changes === 0) {
    return c.json({ error: '既に削除されています' }, 404)
  }

  return c.json({
    success: true,
    message: '愚痴は完全に消去されました 🗑️'
  })
})

// 統計情報（匿名化）
complaintRoutes.get('/stats', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT sentiment, COUNT(*) as count FROM complaints GROUP BY sentiment'
  ).all()

  const total = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM complaints'
  ).first<{ total: number }>()

  return c.json({
    totalShredded: total?.total || 0,
    bySentiment: result.results,
  })
})
