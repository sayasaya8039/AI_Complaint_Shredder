import { GoogleGenerativeAI } from '@google/generative-ai'

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

export async function getEmpathyResponse(complaint: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    // デモモード
    return `それは本当に大変でしたね...😢

「${complaint.slice(0, 30)}...」という状況、本当に辛かったと思います。

あなたの気持ち、よく分かります。そんな中でも頑張っているあなたは本当に偉いです。

では、その嫌な記憶を消去しましょう！🗑️`
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `ユーザーの愚痴: ${complaint}` }
  ])

  return result.response.text()
}
