import { Hono } from 'hono'
import { analyzeAndRespond } from '../gemini'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY: string
}

export const complaintRoutes = new Hono<{ Bindings: Bindings }>()

// 愚痴を投稿（感情分析 + AI応答 + DB保存）
complaintRoutes.post('/', async (c) => {
  const body = await c.req.json<{ content: string }>()
  const { content } = body

  if (!content || content.trim().length === 0) {
    return c.json({ error: '愚痴を入力してください' }, 400)
  }

  // 感情分析 + AI応答
  const analysis = await analyzeAndRespond(content, c.env.GEMINI_API_KEY)

  // D1に一時保存（後で完全削除するため）
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    'INSERT INTO complaints (id, content, sentiment, intensity, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, content, analysis.sentiment, analysis.intensity, now).run()

  return c.json({
    id,
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
