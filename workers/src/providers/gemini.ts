import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider, AnalysisResult } from './types'
import { SYSTEM_PROMPT } from './types'

export class GeminiProvider implements AIProvider {
  name = 'gemini' as const
  
  constructor(private apiKey: string) {}

  async analyze(complaint: string): Promise<AnalysisResult> {
    const genAI = new GoogleGenerativeAI(this.apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: complaint },
    ])

    const text = result.response.text()
    return JSON.parse(text) as AnalysisResult
  }
}
