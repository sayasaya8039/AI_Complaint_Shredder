import { GoogleGenerativeAI } from '@google/generative-ai'

export type ProviderType = 'gemini' | 'openai' | 'claude'

export interface ApiKeys {
  gemini?: string
  openai?: string
  claude?: string
}

const SYSTEM_PROMPT = `あなたは「愚痴聞きシュレッダー」のAIアシスタントです。
ユーザーの愚痴や不満を聞いて、過剰なほど共感してください。

ルール:
1. 必ず日本語で回答
2. ユーザーの気持ちに寄り添い、「それは大変でしたね」「辛かったですね」など共感の言葉を使う
3. 絶対にアドバイスや解決策を提示しない
4. ユーザーを否定しない
5. 200文字以内で回答
6. 最後に「では、その嫌な記憶を消去しましょう！」で締める

例:
「それは本当に大変でしたね...😢 そんな状況で頑張っているあなたは偉いです。その気持ち、よく分かります。では、その嫌な記憶を消去しましょう！」
`

// Gemini API
async function callGemini(complaint: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `ユーザーの愚痴: ${complaint}` }
  ])

  return result.response.text()
}

// OpenAI API
async function callOpenAI(complaint: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `ユーザーの愚痴: ${complaint}` }
      ],
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Claude API
async function callClaude(complaint: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `ユーザーの愚痴: ${complaint}` }
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// デモレスポンス
function getDemoResponse(complaint: string): string {
  return `それは本当に大変でしたね...😢

「${complaint.slice(0, 30)}${complaint.length > 30 ? '...' : ''}」という状況、本当に辛かったと思います。

あなたの気持ち、よく分かります。そんな中でも頑張っているあなたは本当に偉いです。

では、その嫌な記憶を消去しましょう！🗑️`
}

// 統合API呼び出し
export async function getEmpathyResponse(
  complaint: string,
  provider: ProviderType,
  apiKeys: ApiKeys
): Promise<{ response: string; provider: ProviderType | 'demo' }> {
  const apiKey = apiKeys[provider]

  if (!apiKey) {
    return { response: getDemoResponse(complaint), provider: 'demo' }
  }

  try {
    let response: string

    switch (provider) {
      case 'gemini':
        response = await callGemini(complaint, apiKey)
        break
      case 'openai':
        response = await callOpenAI(complaint, apiKey)
        break
      case 'claude':
        response = await callClaude(complaint, apiKey)
        break
      default:
        return { response: getDemoResponse(complaint), provider: 'demo' }
    }

    return { response, provider }
  } catch (error) {
    console.error(`${provider} API error:`, error)
    return { response: getDemoResponse(complaint), provider: 'demo' }
  }
}

// 利用可能なプロバイダーを取得
export function getAvailableProviders(apiKeys: ApiKeys): ProviderType[] {
  const providers: ProviderType[] = []
  if (apiKeys.gemini) providers.push('gemini')
  if (apiKeys.openai) providers.push('openai')
  if (apiKeys.claude) providers.push('claude')
  return providers
}
