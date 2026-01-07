import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { complaintRoutes } from './routes/complaints'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
  OPENAI_API_KEY?: string
  CLAUDE_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS設定
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://ai-complaint-shredder.pages.dev'],
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type'],
}))

// ヘルスチェック
app.get('/', (c) => c.json({
  status: 'ok',
  message: 'AI愚痴聞きシュレッダー API',
  version: '0.3.0',
  providers: ['gemini', 'openai', 'claude'],
}))

// 愚痴関連ルート
app.route('/api/complaints', complaintRoutes)

export default app
